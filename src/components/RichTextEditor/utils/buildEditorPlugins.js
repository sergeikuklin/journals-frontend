import { baseKeymap } from 'prosemirror-commands';
import { dropCursor } from 'prosemirror-dropcursor';
import { gapCursor } from 'prosemirror-gapcursor';
import { history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { tableEditing } from 'prosemirror-tables';
import createEditorKeyMap from './createEditorKeyMap';

// Creates the default plugin for the editor.
export default function buildEditorPlugins(){
  return [
    dropCursor(),
    gapCursor(),
    history(),
    keymap(createEditorKeyMap()),
    keymap(baseKeymap),
    tableEditing()
  ];
}
