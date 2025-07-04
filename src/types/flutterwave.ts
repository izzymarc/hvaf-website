export interface FlutterwaveConfig {
  public_key: string;
  tx_ref: string;
  amount: number;
  currency: string;
  payment_options: string;
  customer: {
    email: string;
    name: string;
  };
  callback: (response: any) => void;
  onclose: () => void;
  customizations?: {
    title?: string;
    description?: string;
    logo?: string;
  };
  text?: string;
}

export interface InitializeFlutterwavePayment {
  callback: (response: any) => void;
  onclose: () => void;
}

export interface FlutterWaveButtonProps {
  public_key: string;
  tx_ref: string;
  amount: number;
  currency: string;
  payment_options: string;
  customer: {
    email: string;
    name: string;
  };
  callback: (response: any) => void;
  onClose: () => void;
  customizations?: {
    title?: string;
    description?: string;
    logo?: string;
  };
  text?: string;
  className?: string;
}
