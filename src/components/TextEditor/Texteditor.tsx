import React, { useMemo } from 'react'
import ReactQuill, { Quill } from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { Box, FormLabel } from '@mui/material'
import './TextEditor.css'

const Delta = Quill.import('delta')
const BaseClipboard = Quill.import('modules/clipboard')

class PlainClipboard extends BaseClipboard {
  quill: any

  constructor(quill: any, options: any) {
    super(quill, options)
    this.quill = quill
  }

  onPaste(e: ClipboardEvent) {
    e.preventDefault()
    const range = this.quill.getSelection()
    if (range) {
      const text = (e.clipboardData || (window as any).clipboardData).getData(
        'text/plain'
      )
      const delta = new Delta().retain(range.index).delete(range.length).insert(text)
      this.quill.updateContents(delta, 'silent')
      this.quill.setSelection(range.index + text.length)
      this.quill.scrollIntoView()
    }
  }
}

Quill.register('modules/clipboard', PlainClipboard, true)

interface TextEditorProps {
  value: string
  onChange: (value: string) => void
}

function TextEditor({ value, onChange }: Readonly<TextEditorProps>) {
  const modules = useMemo(
    () => ({
      toolbar: [
        ['bold', 'italic', 'underline', 'strike', 'link'],
        [{ list: 'ordered' }, { list: 'bullet' }]
      ],
      clipboard: { matchVisual: false }
    }),
    []
  )

  const formats = ['bold', 'italic', 'underline', 'strike', 'link', 'list', 'bullet']

  return (
    <Box sx={{ width: '100%', borderRadius: '8px' }}>
      <FormLabel
        sx={{ color: '#202e5b', fontFamily: 'Lato', fontSize: 16, fontWeight: 600 }}
      >
        What does that entail?
      </FormLabel>
      <Box className='text-editor-container' sx={{ borderRadius: '8px' }}>
        <ReactQuill
          theme='snow'
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder='Add New description'
          style={{ marginTop: '4px', borderRadius: '8px' }}
        />
      </Box>
    </Box>
  )
}

export default TextEditor
