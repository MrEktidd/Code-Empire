#!/usr/bin/env python3
"""Execute the actual checked-in runtime Python code on CPython for fast safety checks."""
import json
import pathlib
import re
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
TEXT = (ROOT / 'src/platform/python/cooperative.ts').read_text(encoding='utf8')
match = re.search(r'COOPERATIVE_RUNTIME = (".*");', TEXT, re.DOTALL)
if not match:
    raise RuntimeError('Missing embedded Python source')
source = json.loads(match.group(1))
scope = {}
exec(compile(source, '<cooperative-runtime>', 'exec'), scope)
SNAP = json.dumps({'tick':0,'workers':[{'id':'npc_1','x':0,'y':0,'capacity':5,'carried':0,
             'harvest_ready':True}], 'resource_nodes':[]})

class CooperativeTests(unittest.TestCase):
    def start(self, code):
        return scope['_ce_start'](self.id(), code, SNAP, 'npc_1')
    def resume(self, value):
        return scope['_ce_resume'](self.id(), SNAP, value)
    def test_continuous_while(self):
        result = self.start('while True:\n    self.move("east")\n    self.move("west")')
        self.assertEqual(result['request']['direction'], 'east')
        self.assertEqual(self.resume({'ok':True})['request']['direction'], 'west')
        self.assertEqual(self.resume({'ok':True})['request']['direction'], 'east')
    def test_nested_helper_and_return(self):
        result = self.start('def travel():\n    self.move("east")\n    return 5\nwhile True:\n    print(travel())\n    await world.wait_ticks(3)')
        self.assertEqual(result['request']['kind'], 'move')
        later = self.resume({'ok':True})
        self.assertEqual(later['request']['kind'],'wait_ticks')
        self.assertEqual(later['output'],['5'])
    def test_multiple_controllers_isolated(self):
        a=scope['_ce_start']('A','while True:\n    self.move("north")',SNAP,'npc_1')
        b=scope['_ce_start']('B','while True:\n    self.move("south")',SNAP,'npc_1')
        self.assertEqual(a['request']['direction'],'north')
        self.assertEqual(b['request']['direction'],'south')
        self.assertEqual(scope['_ce_resume']('A',SNAP,{'ok':True})['request']['direction'],'north')
    def test_infinite_loop_is_bounded(self):
        result=self.start('while True:\n    pass')
        self.assertEqual(result['kind'],'error')
        self.assertIn('loop iterations',result['error'])
    def test_timed_job_protocol(self):
        result=self.start('job=self.harvest()\nawait world.job_completed(job["job_id"])')
        self.assertEqual(result['request']['kind'],'harvest')
        result=self.resume({'ok':True,'job_id':'job_123'})
        self.assertEqual(result['request'],{'kind':'job_completed','jobId':'job_123'})
    def test_complete_program(self):
        result=self.start('print("hello")')
        self.assertEqual(result['kind'],'done')
        self.assertEqual(result['output'],['hello'])
    def test_stop_discards_live_frame(self):
        self.start('while True:\n    self.move("east")')
        scope['_ce_stop'](self.id())
        self.assertEqual(self.resume(None)['kind'],'error')
if __name__=='__main__':
    unittest.main()
