type MountConfig = {
    checkoutId: string,
    onResponse?: (status: string, response: CheckoutSubmitResponse) => void,
    onLoad?: (e) => void,
    onPaymentMethodLoad?: (e) => void,
    onChangeInstallments?: (e) => void,
    showSubmitButton?: boolean,
    showFooter?: boolean,
    showInstallments?: boolean,
    showZipCode?: boolean,
    showEmail?: boolean,
    email?: string,
    installments?: number,
    maxInstallments?: number,
    donateSubmitButton?: boolean,
    amount?: string,
    currency?: string,
    locale?: string,
    country?: string,
    googlePay?: { merchantId: string, merchantName: string },
    id?: string,
    redirect_url?: string,
    return_url?: string
    valid_until?: string
}

type CheckoutSubmitResponse = {
    amount: number,
    checkout_reference: string,
    currency: string,
    description: string,
    merchant_code: string,
    merchant_name?: string,
    status: string,
    id: string,
    transaction_id: string,
    transaction_code: string,
    valid_until?: string,

    error_code?: string,
}

export type MountReturns = {
    submit: () => void,
    unmount: () => void,
    update: (config: MountConfig) => void,
}
type SumUpCard = {
    debug: (e) => void;
    mount: (config: MountConfig) => MountReturns;
}

declare global {
    interface Window {
      SumUpCard: SumUpCard;
    }
  }
  
  export {};