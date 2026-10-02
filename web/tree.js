/* Parse tree rendering: a collapsible tree of the real ParseNode structure,
 * with source spans so a node can be traced back to the code that produced it. */

const KIND_LABELS = {
  // Present the node class names the parser sources use, so the tree reads the
  // way ParseNode.h describes it.
  Function: 'Function',
  Module: 'Module',
  LexicalScope: 'LexicalScope',
  ClassBodyScope: 'ClassBodyScope',
};

/** Children of a node, in the order the parser stores them. */
function childEntries(node) {
  const out = [];
  if (!node || typeof node !== 'object') {
    return out;
  }
  for (const [key, value] of Object.entries(node)) {
    if (key === 'kind' || key === 'extent' || key === 'text' || key === 'value' ||
        key === 'count' || key === 'index' || key === 'flags' ||
        key === 'isStatic' || key === 'isDefault' || key === 'hasDefault') {
      continue;
    }
    if (Array.isArray(value)) {
      value.forEach((item, i) => out.push([`${key}[${i}]`, item]));
    } else if (value && typeof value === 'object') {
      out.push([key, value]);
    }
  }
  return out;
}

/** A short one-line summary of a node's own payload. */
function nodeDetail(node) {
  const bits = [];
  if (typeof node.text === 'string' && node.text.length) {
    bits.push(JSON.stringify(node.text));
  }
  if (typeof node.value === 'number') {
    bits.push(String(node.value));
  }
  if (typeof node.count === 'number') {
    bits.push(`${node.count} item${node.count === 1 ? '' : 's'}`);
  }
  if (node.isStatic) {
    bits.push('static');
  }
  if (node.hasDefault) {
    bits.push('has default');
  }
  return bits.join(' ');
}

function countNodes(node, acc = { n: 0, depth: 0 }, depth = 0) {
  if (!node || typeof node !== 'object') {
    return acc;
  }
  acc.n += 1;
  acc.depth = Math.max(acc.depth, depth);
  for (const [, child] of childEntries(node)) {
    countNodes(child, acc, depth + 1);
  }
  return acc;
}

function makeNodeEl(label, node, onSelect) {
  const li = document.createElement('li');
  li.className = 'tree-node';

  const row = document.createElement('div');
  row.className = 'tree-row';

  const kids = childEntries(node);
  const twisty = document.createElement('span');
  twisty.className = kids.length ? 'twisty' : 'twisty leaf';
  twisty.textContent = kids.length ? '\u25B8' : '';
  row.appendChild(twisty);

  const name = document.createElement('span');
  name.className = 'node-kind';
  name.textContent = KIND_LABELS[node.kind] || node.kind;
  row.appendChild(name);

  if (label) {
    const field = document.createElement('span');
    field.className = 'node-field';
    field.textContent = label;
    row.appendChild(field);
  }

  const detail = nodeDetail(node);
  if (detail) {
    const d = document.createElement('span');
    d.className = 'node-detail';
    d.textContent = detail;
    row.appendChild(d);
  }

  if (node.extent) {
    const span = document.createElement('span');
    span.className = 'node-extent';
    span.textContent = `${node.extent.start}..${node.extent.end}`;
    row.appendChild(span);
  }

  li.appendChild(row);

  let childList = null;
  if (kids.length) {
    childList = document.createElement('ul');
    childList.className = 'tree-children';
    for (const [childLabel, child] of kids) {
      childList.appendChild(makeNodeEl(childLabel, child, onSelect));
    }
    li.appendChild(childList);

    const toggle = (open) => {
      li.classList.toggle('collapsed', !open);
      twisty.textContent = open ? '\u25BE' : '\u25B8';
    };
    toggle(true);
    twisty.addEventListener('click', (e) => {
      e.stopPropagation();
      toggle(li.classList.contains('collapsed'));
    });
  }

  row.addEventListener('click', () => onSelect(node));
  return li;
}

function renderTree(container, root, onSelect) {
  container.textContent = '';
  if (!root) {
    return;
  }
  if (root.error) {
    const div = document.createElement('div');
    div.className = 'tree-error';
    div.textContent = root.error;
    container.appendChild(div);
    return;
  }
  const ul = document.createElement('ul');
  ul.className = 'tree-root';
  ul.appendChild(makeNodeEl('', root, onSelect));
  container.appendChild(ul);
}

export { renderTree, childEntries, countNodes };
