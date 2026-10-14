import { describe, expect, it } from 'vitest';
import { PYTHON_CATEGORIES, PYTHON_TOPICS, filterPythonTopics } from './python';
import { API } from './api';

describe('Python language handbook', () => {
  it('covers foundational Python concepts independent of lesson progression', () => {
    const required = [
      'variables', 'types', 'ints', 'floats', 'strings', 'booleans', 'none',
      'lists', 'tuples', 'dicts', 'sets', 'functions', 'if-elif',
      'for-loops', 'while-loops', 'errors', 'readable-code'
    ];
    for (const id of required) expect(PYTHON_TOPICS.some(topic => topic.id === id)).toBe(true);
    expect(PYTHON_TOPICS.length).toBeGreaterThanOrEqual(35);
  });
  it('uses unique stable topic IDs and organized populated sections', () => {
    const ids = PYTHON_TOPICS.map(topic => topic.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(PYTHON_CATEGORIES).size).toBe(PYTHON_CATEGORIES.length);
    for (const topic of PYTHON_TOPICS) {
      expect(PYTHON_CATEGORIES).toContain(topic.category);
      expect(topic.title.length).toBeGreaterThan(3);
      expect(topic.explanation.length).toBeGreaterThan(35);
      expect(topic.code.length).toBeGreaterThan(10);
      expect(topic.watch.length).toBeGreaterThan(12);
    }
  });
  it('filters by content and chapter, independent of any in-game lessons', () => {
    expect(filterPythonTopics('append').some(t => t.id === 'lists')).toBe(true);
    expect(filterPythonTopics('wood', 'Data Types').every(t => t.category === 'Data Types')).toBe(true);
    expect(filterPythonTopics('', 'Collections').length).toBeGreaterThanOrEqual(5);
    expect(filterPythonTopics('UNLIKELY_SEARCH_TERM_9271')).toHaveLength(0);
    expect(filterPythonTopics('')).toHaveLength(PYTHON_TOPICS.length);
  });
  it('keeps engine-specific APIs in their own registry', () => {
    expect(API.some(a => a.name === 'world.workers')).toBe(true);
    expect(PYTHON_TOPICS.some(t => t.id === 'world.workers')).toBe(false);
  });
});
