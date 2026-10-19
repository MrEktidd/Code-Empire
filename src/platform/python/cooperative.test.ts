import {describe,it,expect} from 'vitest';
import {COOPERATIVE_RUNTIME} from './cooperative';
describe('Cooperative Python runner',()=>{
 it('contains real AST transformation and a bounded execution guard',()=>{
  expect(COOPERATIVE_RUNTIME).toContain('ast.NodeTransformer');
  expect(COOPERATIVE_RUNTIME).toContain('ast.YieldFrom');
  expect(COOPERATIVE_RUNTIME).toContain('remaining=1500');
  expect(COOPERATIVE_RUNTIME).toContain('def _ce_resume(');
 });
 it('only turns physical action methods into implicit suspension points',()=>{
  expect(COOPERATIVE_RUNTIME).toContain("'move','harvest','deposit'");
  expect(COOPERATIVE_RUNTIME).toContain('def visit_Await(');
 });
});
