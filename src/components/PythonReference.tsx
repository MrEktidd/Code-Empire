import { useEffect, useMemo, useState } from 'react';
import { PYTHON_CATEGORIES, PYTHON_TOPICS, filterPythonTopics } from '../docs/python';
import type { PythonTopic } from '../docs/python';
import './PythonReference.css';

type Props = { focusTopicId?: string };

export default function PythonReference({ focusTopicId }: Props) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedId, setSelectedId] = useState(focusTopicId ?? 'python-start');
  const [copyMessage, setCopyMessage] = useState('');

  useEffect(() => {
    if (focusTopicId && PYTHON_TOPICS.some(t => t.id === focusTopicId)) {
      setSelectedId(focusTopicId);
      setCategory('All');
      setQuery('');
    }
  }, [focusTopicId]);

  const filtered = useMemo(() => filterPythonTopics(query, category), [query, category]);
  const selected = filtered.find(t => t.id === selectedId) ?? filtered[0];

  const selectTopic = (topic: PythonTopic) => {
    setSelectedId(topic.id);
    setCopyMessage('');
  };

  const copyExample = async (code: string) => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard not available');
      await navigator.clipboard.writeText(code);
      setCopyMessage('Example copied. Paste it into a Python script.');
    } catch {
      setCopyMessage('Copy unavailable in this browser. Select the example text to copy.');
    }
  };

  return <div className="python-ref">
    <div className="python-ref-header">
      <div>
        <span className="eyebrow">THE PROGRAMMER'S LIBRARY</span>
        <h2>Python Reference</h2>
        <p>Plain-language explanations, real Python examples, and common pitfalls. Browse freely—no lessons to unlock.</p>
      </div>
      <span className="python-ref-count">{PYTHON_TOPICS.length} TOPICS</span>
    </div>
    <div className="python-ref-search">
      <label htmlFor="python-ref-query">SEARCH PYTHON CONCEPTS</label>
      <input id="python-ref-query" type="search" placeholder="Try: lists, append, float, for, dictionaries…" value={query}
        onChange={e => setQuery(e.target.value)} autoComplete="off" />
      <label htmlFor="python-ref-category">SECTION</label>
      <select id="python-ref-category" value={category} onChange={e => setCategory(e.target.value)}>
        <option value="All">All sections</option>
        {PYTHON_CATEGORIES.map(name => <option key={name}>{name}</option>)}
      </select>
    </div>
    <div className="python-ref-body">
      <nav className="python-ref-nav" aria-label="Python reference topics">
        <div className="python-ref-results">{filtered.length} matching topics</div>
        {PYTHON_CATEGORIES.map(section => {
          const topics = filtered.filter(t => t.category === section);
          if (topics.length === 0) return null;
          return <div className="python-ref-group" key={section}>
            <h3>{section}</h3>
            {topics.map(topic => <button key={topic.id} type="button"
              className={selected?.id === topic.id ? 'current' : ''}
              aria-current={selected?.id === topic.id ? 'true' : undefined}
              onClick={() => selectTopic(topic)}>
              {topic.title}
            </button>)}
          </div>;
        })}
      </nav>
      <article className="python-ref-article" key={selected?.id ?? 'empty'}>
        {selected ? <>
          <span className="python-ref-chapter">{selected.category}</span>
          <h2>{selected.title}</h2>
          <p className="python-ref-summary">{selected.summary}</p>
          {selected.explanation.split('\n\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          <div className="python-ref-example-head">
            <h3>Example in Python</h3>
            <button type="button" onClick={() => void copyExample(selected.code)}>⧉ Copy example</button>
          </div>
          <pre className="python-ref-code"><code>{selected.code}</code></pre>
          {copyMessage && <p role="status" className="python-ref-copy-status">{copyMessage}</p>}
          <div className="python-ref-tip">
            <strong>Keep in mind</strong>
            <p>{selected.watch}</p>
          </div>
          <div className="python-ref-bottom">
            <a href="https://docs.python.org/3/tutorial/" target="_blank" rel="noreferrer">Official Python Tutorial ↗</a>
            <a href="https://docs.python.org/3/library/stdtypes.html" target="_blank" rel="noreferrer">Python Built-in Types ↗</a>
          </div>
        </> : <div className="python-ref-empty">
          <h2>No matching topics</h2>
          <p>Try a different search term or choose “All sections.”</p>
          <button type="button" onClick={() => { setQuery(''); setCategory('All'); }}>Clear search</button>
        </div>}
      </article>
    </div>
    <div className="python-ref-footer">This handbook explains Python itself. For <b>self.order()</b>, <b>world.workers()</b>, and other game commands, open <b>Game API</b> instead.</div>
  </div>;
}
