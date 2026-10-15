/** Python snippets executed by the game-agnostic worker. Injected game bridge
 * populates 'world', 'self' and callback_args using the isolated snapshot.
 */
export const RUNNER = [
'import json, io, sys, traceback',
'_ce_snapshot_value = json.loads(_ce_snapshot)',
'memory = json.loads(_ce_memory)',
'commands = []',
'namespace = {"memory":memory,"__name__":"__main__"}',
'callback_args = ()',
'exec(_ce_adapter_source, globals(), globals())',
'capture = io.StringIO()',
'previous_stdout = sys.stdout',
'try:',
'    sys.stdout = capture',
'    exec(compile(_ce_source, "<controller>", "exec"), namespace, namespace)',
'    callback = namespace.get("on_tick")',
'    if callable(callback): callback(*callback_args)',
'finally:',
'    sys.stdout = previous_stdout',
'output = capture.getvalue()[:6000].splitlines()[:40]',
'_ce_result = json.dumps({"commands":commands[:64],"memory":memory,"output":output})'
].join('\n');
