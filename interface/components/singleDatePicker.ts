import type {PropType} from 'vue'

export const singleDatePickerProps = {
    start: {
        type: String,
    },
    end: {
        type: String,
    },
    valueFormat: {
        type: String,
    },
    type: {
        type: String as PropType<'datetimerange' | 'daterange' | 'monthrange'>,
        required: true
    },
    startPlaceholder: {
        type: String,
    },
    endPlaceholder: {
        type: String,
    },
    rangeSeparator: {
        type: String,
    },
}
