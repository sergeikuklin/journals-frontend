import React from 'react';
import Renderer from '../Renderer';

function headingView(props) {
  const { level } = props.node.attrs;
  const tags = {
    1: 'h1',
    2: 'h2',
    3: 'h3',
    4: 'h4'
  };

  let args = [tags[level], { className: props.className }];

  if (props.node.content && props.node.content.length > 0) {
    args = args.concat(props.node.content.map(function(node) {
      return <Renderer raw={ node } />;
    }));
  }

  return React.createElement.apply(React, args);
}

export default headingView;
