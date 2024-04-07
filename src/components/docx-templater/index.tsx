'use client'
import Docxtemplater from 'docxtemplater'
import PizZip from 'pizzip'
import PizZipUtils from 'pizzip/utils/index.js'
import { saveAs } from 'file-saver'

export default function App() {
  const date = new Date()

  const generateDocument = async () => {
    try {
      const res = await fetch('/official.docx')
      const buffer = await res.arrayBuffer()

      var zip = new PizZip(buffer)
      var doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      })
      doc.setData({
        nombre: 'HOLAAAAAAAAAA',
        signing_location: 'Toulouse',
        signing_date: `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
        first_name: 'Sébastien',
        last_name: 'François',
        birth_date: '19 août 1994',
        claim_type: 'Casse',
        incident_location: '3 rue Ella Maillart, 31300 Toulouse',
        incident_timestamp: new Date().getFullYear(),
        bike_name: 'Vélo de champion',
        incident_description:
          'Faits et actions avant, pendant, après le sinistre',
        customer_name: 'Morio',
      })
      doc.render()

      var out = doc.getZip().generate({
        type: 'blob',
        mimeType:
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      })
      saveAs(out, 'déclaration_circonstanciée.docx')
    } catch (error) {
      console.error('Error generating document:', error)
    }
  }

  return (
    <div className="p-2">
      <button onClick={generateDocument}>Generate document</button>
    </div>
  )
}
