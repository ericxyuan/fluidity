'use client';

import { useId, useState } from 'react';
import { AppleGlassCard } from './extensions/apple-glass-card';
import { StackedCardSet } from './extensions/stacked-card-set';
import { Disclosure as PersistentDisclosure } from './composition/measured-disclosure';
import { DirectionAwareTabs } from './composition/direction-aware-tabs';
import { Disclosure } from './motion/disclosure';
import { SelectionIndicator } from './motion/selection-indicator';
import { InlineEdit } from './application/InlineEdit';
import './fluidity.css';

export function FluidityExamples() {
  const group = useId();
  const [stage, setStage] = useState('draft');
  const [tab, setTab] = useState('overview');
  const [name, setName] = useState('Project notes');
  const [period, setPeriod] = useState('week');
  const [instant, setInstant] = useState(true);
  return (
    <div className="fluidity-example-grid">
      <AppleGlassCard aria-labelledby={`${group}-glass`}>
        <h2 id={`${group}-glass`}>Project overview</h2>
        <p>A readable surface that takes its material and spacing from your project.</p>
        <PersistentDisclosure.Root>
          <PersistentDisclosure.Trigger>Show project details</PersistentDisclosure.Trigger>
          <PersistentDisclosure.Content>
            <p>The draft remains mounted when this section closes.</p>
            <label>Private note <input defaultValue="Review the keyboard flow" /></label>
          </PersistentDisclosure.Content>
        </PersistentDisclosure.Root>
      </AppleGlassCard>
      <StackedCardSet label="Project stages" value={stage} onValueChange={setStage}
        items={[
          { id: 'draft', label: 'Draft', content: <><h2>Draft</h2><p>Organize the information and make the main action easy to find.</p><a href="#review">Read review criteria</a></> },
          { id: 'review', label: 'Review', content: <><h2>Review</h2><p>Check keyboard operation, cancellation and constrained width.</p><button type="button" onClick={() => setStage('ready')}>Mark ready</button></> },
          { id: 'ready', label: 'Ready', content: <><h2>Ready</h2><p>The example is ready for the next step.</p></> },
        ]} />
      <section aria-label="Local panels">
        <h2>Details on demand</h2>
        <DirectionAwareTabs label="Project information" value={tab} onValueChange={setTab}
          tabs={[
            { id: 'overview', label: 'Overview', content: <p>Keep this panel brief and immediately available.</p> },
            { id: 'activity', label: 'Activity', content: <p>Changes stay connected to the selected section.</p> },
          ]} />
        <Disclosure summary="Show checklist">
          <label><input type="checkbox" /> Check the primary action</label>
        </Disclosure>
      </section>
      <section id="review" aria-label="Editable information">
        <h2>Stable, useful controls</h2>
        <InlineEdit label="Project name" value={name} onSave={setName} validate={next => next.trim() ? undefined : 'Enter a project name.'} />
        <div role="group" aria-label="Reporting period" style={{ display: 'flex', marginTop: '1rem' }}>
          {['day', 'week', 'month'].map(value => <button key={value} type="button"
            aria-pressed={period === value} style={{ position: 'relative', isolation: 'isolate', padding: '.75rem' }}
            onClick={event => { setInstant(event.detail === 0); setPeriod(value); }}>
            <SelectionIndicator active={period === value} groupId={group} instant={instant} style={{ background: '#dbe7f1' }} />
            <span style={{ position: 'relative' }}>{value}</span>
          </button>)}
        </div>
      </section>
    </div>
  );
}
