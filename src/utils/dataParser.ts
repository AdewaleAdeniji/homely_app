import numeral from 'numeral'


export function parsePhoneNumberWithCountryCode(phoneNumber: string) {
    return phoneNumber && phoneNumber.trim() ? phoneNumber.replace(/^(\+)?234/, '0') : phoneNumber
}

export function parseAmountToCurrencyValue(amount: number | string, currency = 'NGN') {
    let currencyValue = ""

    if (!isNaN(parseFloat(amount as string))) {
        currencyValue = `${currency}${numeral(amount).format("0,0.00")}`
    }

    return currencyValue
}

export function parseValuesToPercent(givenValue: number, totalValue: number) {
    return !parseFloat(totalValue.toString()) || isNaN(parseFloat(givenValue.toString()))
        ? 0
        : parseFloat(Number((givenValue / totalValue) * 100).toFixed(2))
}

export function parseAddressObjectToString(addressObj: { city: string; lineOne: string; lineTwo: string }) {
    if (addressObj) {
        const { lineOne, lineTwo, city } = addressObj

        return Object.values({ lineOne, lineTwo, city })
            .filter(itm => Boolean(itm))
            .join(', ')
    } else {
        return ""
    }
}

export function parseTableSearchParams(formValues: Record<string, any>) {
    let searchParams = formValues
        ? Object.keys(formValues).reduce((reducedObject: any, key: any) => {
            if (formValues[key]) {
                reducedObject[key] = formValues[key]?.trim ? formValues[key]?.trim() : formValues[key]
            }
            return reducedObject;
        }, {})
        : formValues;

    return searchParams;
}