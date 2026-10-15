/** Serializes writes and guarantees a bounded interval between saves during active simulation.
 * A coordinator never writes an older snapshot after a newer one; it only asks for
 * the most recent snapshot when a write actually begins.
 */
export class SaveCoordinator<T> {
  private dirty = false;
  private timeout: ReturnType<typeof setTimeout> | undefined;
  private ticker: ReturnType<typeof setInterval> | undefined;
  private inFlight: Promise<void> = Promise.resolve();
  private generation = 0;
  private lastError: Error | null = null;
  private status: 'saved' | 'unsaved' | 'saving' | 'error' = 'saved';
  constructor(private read:()=>T,private write:(state:T)=>Promise<void>,private notify:(status:'saved'|'unsaved'|'saving'|'error',error?:Error)=>void,
    private debounceMs=800,private periodicMs=5000){}
  start():void {
    if(this.ticker)return;
    this.ticker=setInterval(()=>{if(this.dirty)void this.flush();},this.periodicMs);
  }
  markDirty():void {
    this.dirty=true;this.generation++;this.status='unsaved';this.notify('unsaved');
    if(!this.timeout)this.timeout=setTimeout(()=>{this.timeout=undefined;void this.flush();},this.debounceMs);
  }
  async flush():Promise<void>{
    if(this.timeout){clearTimeout(this.timeout);this.timeout=undefined;}
    if(!this.dirty){await this.inFlight;return;}
    const snapshot=this.read(), version=this.generation;
    this.dirty=false;this.status='saving';this.notify('saving');
    const write=this.inFlight.catch(()=>{}).then(()=>this.write(snapshot));
    this.inFlight=write.then(()=>{
      if(!this.dirty && this.generation===version){this.status='saved';this.lastError=null;this.notify('saved');}
    },error=>{
      this.dirty=true;this.status='error';this.lastError=error instanceof Error?error:new Error(String(error));
      this.notify('error',this.lastError);
      throw this.lastError;
    });
    await this.inFlight;
  }
  async dispose():Promise<void>{
    if(this.timeout){clearTimeout(this.timeout);this.timeout=undefined;}
    if(this.ticker){clearInterval(this.ticker);this.ticker=undefined;}
    if(this.dirty)await this.flush();
    else await this.inFlight;
  }
  getState(){return {status:this.status,error:this.lastError};}
}
