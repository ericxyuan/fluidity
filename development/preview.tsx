import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { FluidityExamples } from '../fluidity/skills/fluidity-components/assets/examples';
import { StackedCardSet } from '../fluidity/skills/fluidity-components/assets/extensions/stacked-card-set';
import { InlineEdit } from '../fluidity/skills/fluidity-components/assets/application/InlineEdit';
import { DirectionAwareTabs } from '../fluidity/skills/fluidity-components/assets/composition/direction-aware-tabs';
import { TransitionPanel } from '../fluidity/skills/fluidity-components/assets/motion/transition-panel';
import './preview.css';

function EdgeCases() {
  const [items, setItems] = useState(['one', 'two', 'three']);
  const [value, setValue] = useState('one');
  const [edit, setEdit] = useState('Existing');
  const [tabIds, setTabIds] = useState(['alpha', 'beta', 'gamma']);
  const [tab, setTab] = useState('alpha');
  const [panel, setPanel] = useState(0);
  const [instant, setInstant] = useState(false);
  return <section aria-label="Edge cases"><h2>Validation edge cases</h2>
    <StackedCardSet label="Dynamic cards" value={value} onValueChange={setValue}
      items={items.map(id => ({ id, label: id, content: <><h3>{id}</h3><input aria-label={`Draft ${id}`} /></> }))} />
    <button onClick={() => setItems(items.filter(id => id !== value))}>Remove selected card</button>
    <button onClick={() => setItems([])}>Empty cards</button>
    <InlineEdit label="Rejecting save" value={edit} onSave={async () => { throw new Error('Expected rejection'); }} />
    <InlineEdit label="Conflicting edit" value={edit} onSave={setEdit} />
    <button onClick={() => setEdit('Changed elsewhere')}>Simulate external update</button>
    <DirectionAwareTabs label="Dynamic panels" value={tab} onValueChange={setTab}
      tabs={tabIds.map(id => ({ id, label: id, content: <><h3>{id} details</h3>
        <button onClick={() => setTabIds(ids => ids.filter(item => item !== id))}>Remove this panel</button>
      </> }))} />
    <section aria-label="Presence edge case">
      <button onClick={event => { setInstant(event.detail === 0); setPanel(n => n + 1); }}>Change presence content</button>
      <TransitionPanel activeKey={String(panel)} instant={instant} direction={1}>
        <p data-presence-frame>{`Content ${panel}`}</p>
      </TransitionPanel>
    </section>
  </section>;
}
createRoot(document.getElementById('root')!).render(<StrictMode><main>
  <header><p className="eyebrow">FLUIDITY · LOCAL IMPLEMENTATIONS</p><h1>Behavior before decoration.</h1>
    <p>Source-derived components with clear state, responsive composition and restrained motion.</p></header>
  <FluidityExamples />
  {new URLSearchParams(location.search).has('test') && <EdgeCases />}
</main></StrictMode>);
