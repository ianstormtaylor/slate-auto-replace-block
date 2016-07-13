
import AutoReplaceBlock from '..'
import React from 'react'
import ReactDOM from 'react-dom'
import initialState from './state.json'
import { Editor, Raw } from 'slate'

class Example extends React.Component {

  nodes = {
    quote: props => <blockquote {...props.attributes}><p>{props.children}</p></blockquote>,
    header: props => <h3 {...props.attributes}>{props.children}</h3>,
    hr: props => <hr />
  }

  plugins = [
    AutoReplaceBlock({
      trigger: 'space',
      before: /^(>)$/,
      properties: {
        type: 'quote'
      }
    }),
    AutoReplaceBlock({
      trigger: 'space',
      before: /^(#{1,6})$/,
      properties: {
        type: 'header'
      }
    }),
    AutoReplaceBlock({
      trigger: 'enter',
      before: /^(-{3})$/,
      properties: {
        type: 'hr',
        isVoid: true
      }
    })
  ];

  state = {
    state: Raw.deserialize(initialState)
  };

  onChange = (state) => {
    this.setState({ state })
  }

  render = () => {
    return (
      <Editor
        onChange={this.onChange}
        plugins={this.plugins}
        state={this.state.state}
        renderNode={this.renderNode}
      />
    )
  }

  renderNode = (node) => {
    return this.nodes[node.type]
  }

}

const example = <Example />
const root = document.body.querySelector('main')
ReactDOM.render(example, root)
