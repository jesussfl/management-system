import spanishLayout from 'simple-keyboard-layouts/build/layouts/spanish' // español
import englishLayout from 'simple-keyboard-layouts/build/layouts/english' // inglés
import russianLayout from 'simple-keyboard-layouts/build/layouts/russian' // ruso
import chineseLayout from 'simple-keyboard-layouts/build/layouts/chinese' // chino
import arabicLayout from 'simple-keyboard-layouts/build/layouts/arabic' // arabe
import frenchLayout from 'simple-keyboard-layouts/build/layouts/french' // francés
import japaneseLayout from 'simple-keyboard-layouts/build/layouts/japanese' // japones
import koreanLayout from 'simple-keyboard-layouts/build/layouts/korean' // coreano
import turkishLayout from 'simple-keyboard-layouts/build/layouts/turkish' // portugues
import germanLayout from 'simple-keyboard-layouts/build/layouts/german' // aleman
export const getCurrentLayout = (language: string) => {
  switch (language) {
    case 'spanish':
      return spanishLayout
    case 'english':
      return englishLayout
    case 'russian':
      return russianLayout
    case 'chinese':
      return chineseLayout
    case 'arabic':
      return arabicLayout
    case 'french':
      return frenchLayout
    case 'japanese':
      return japaneseLayout
    case 'korean':
      return koreanLayout
    case 'turkish':
      return turkishLayout
    case 'german':
      return germanLayout
    default:
      return spanishLayout
  }
}
