<script lang="ts">
  import type { IngredientGroup } from '$core/models/Recipe'
  import { scaleHtml } from '$core/utils/quantityScaler'

  interface Props {
    ingredients: IngredientGroup[]
    steps: string[]
    notes?: string[]
    scale?: number
    /** Heading level for section titles — h2 on a dedicated page, h3 inside a card */
    sectionTag?: 'h2' | 'h3'
  }

  let { ingredients, steps, notes = [], scale = 1, sectionTag = 'h2' }: Props = $props()
</script>

<section class="recipe-section">
  <svelte:element this={sectionTag} class="section-title">Ingrédients</svelte:element>
  {#each ingredients as group}
    {#if group.name}
      <p class="group-name">{group.name}</p>
    {/if}
    <ul>
      {#each group.items as item}
        <li>{@html scaleHtml(item, scale)}</li>
      {/each}
    </ul>
  {/each}
</section>

<section class="recipe-section">
  <svelte:element this={sectionTag} class="section-title">Étapes</svelte:element>
  <ol class="steps">
    {#each steps as step, index}
      <li>
        <span class="step-number">{index + 1}</span>
        <span class="step-content">{@html scaleHtml(step, scale)}</span>
      </li>
    {/each}
  </ol>
</section>

{#if notes && notes.length > 0}
  <section class="recipe-section">
    <svelte:element this={sectionTag} class="section-title">Notes & Tips</svelte:element>
    <ul>
      {#each notes as note}
        <li>{@html scaleHtml(note, scale)}</li>
      {/each}
    </ul>
  </section>
{/if}

<style>
  .recipe-section {
    margin-bottom: var(--spacing-2xl);
  }

  .section-title {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-bold);
    text-transform: uppercase;
    margin-bottom: var(--spacing-md);
  }

  .group-name {
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-bold);
    margin: var(--spacing-md) 0 var(--spacing-sm) 0;
  }

  .recipe-section ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .recipe-section ul li {
    padding: var(--spacing-xs) 0;
    padding-left: var(--spacing-lg);
    position: relative;
  }

  .recipe-section ul li::before {
    content: '•';
    position: absolute;
    left: 0;
    font-weight: var(--font-weight-bold);
  }

  .steps {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .steps li {
    display: flex;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
  }

  .step-number {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    background: var(--color-interactive-default);
    color: var(--color-text-inverted);
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: var(--font-weight-bold);
    font-size: var(--font-size-sm);
  }

  .step-content {
    flex: 1;
    line-height: var(--line-height-tight);
    padding-top: var(--spacing-xs);
  }
</style>
