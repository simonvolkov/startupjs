/* @asyncImports */
import { faSpellCheck } from '@fortawesome/free-solid-svg-icons'
import ArrayInputEn from '../components/forms/ArrayInput/ArrayInput.en.mdx'
import ArrayInputRu from '../components/forms/ArrayInput/ArrayInput.ru.mdx'
import CheckboxEn from '../components/forms/Checkbox/Checkbox.en.mdx'
import CheckboxRu from '../components/forms/Checkbox/Checkbox.ru.mdx'
import DateTimePicker from '../components/forms/DateTimePicker/DateTimePicker.mdx'
import InputEn from '../components/forms/Input/Input.en.mdx'
import InputRu from '../components/forms/Input/Input.ru.mdx'
import MultiselectEn from '../components/forms/Multiselect/Multiselect.en.mdx'
import MultiselectRu from '../components/forms/Multiselect/Multiselect.ru.mdx'
import NumberInputEn from '../components/forms/NumberInput/NumberInput.en.mdx'
import NumberInputRu from '../components/forms/NumberInput/NumberInput.ru.mdx'
import ObjectInputEn from '../components/forms/ObjectInput/ObjectInput.en.mdx'
import ObjectInputRu from '../components/forms/ObjectInput/ObjectInput.ru.mdx'
import PasswordInputEn from '../components/forms/PasswordInput/PasswordInput.en.mdx'
import PasswordInputRu from '../components/forms/PasswordInput/PasswordInput.ru.mdx'
import RadioEn from '../components/forms/Radio/Radio.en.mdx'
import RadioRu from '../components/forms/Radio/Radio.ru.mdx'
import SelectEn from '../components/forms/Select/Select.en.mdx'
import SelectRu from '../components/forms/Select/Select.ru.mdx'
import TextInputEn from '../components/forms/TextInput/TextInput.en.mdx'
import TextInputRu from '../components/forms/TextInput/TextInput.ru.mdx'

export default {
  type: 'collapse',
  title: {
    en: 'Forms',
    ru: 'Формы'
  },
  icon: faSpellCheck,
  items: {
    Array: {
      type: 'mdx',
      title: 'ArrayInput',
      component: {
        en: ArrayInputEn,
        ru: ArrayInputRu
      }
    },
    Checkbox: {
      type: 'mdx',
      title: 'Checkbox',
      component: {
        en: CheckboxEn,
        ru: CheckboxRu
      }
    },
    DateTimePicker: {
      type: 'mdx',
      title: 'DateTimePicker',
      component: DateTimePicker
    },
    Input: {
      type: 'mdx',
      title: 'Input',
      component: {
        en: InputEn,
        ru: InputRu
      }
    },
    Multiselect: {
      type: 'mdx',
      title: 'Multiselect',
      component: {
        en: MultiselectEn,
        ru: MultiselectRu
      }
    },
    NumberInput: {
      type: 'mdx',
      title: 'NumberInput',
      component: {
        en: NumberInputEn,
        ru: NumberInputRu
      }
    },
    ObjectInput: {
      type: 'mdx',
      title: 'ObjectInput',
      component: {
        en: ObjectInputEn,
        ru: ObjectInputRu
      }
    },
    PasswordInput: {
      type: 'mdx',
      title: 'PasswordInput',
      component: {
        en: PasswordInputEn,
        ru: PasswordInputRu
      }
    },
    Radio: {
      type: 'mdx',
      title: 'Radio',
      component: {
        en: RadioEn,
        ru: RadioRu
      }
    },
    Select: {
      type: 'mdx',
      title: 'Select',
      component: {
        en: SelectEn,
        ru: SelectRu
      }
    },
    TextInput: {
      type: 'mdx',
      title: 'TextInput',
      component: {
        en: TextInputEn,
        ru: TextInputRu
      }
    }
  }
}
