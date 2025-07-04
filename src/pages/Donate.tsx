
import React, { useState, useRef } from 'react';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { trackDonation, trackEvent } from '@/utils/analytics';

const supportedCurrencies = [
  { value: 'NGN', label: '₦ Naira (NGN)' },
  { value: 'USD', label: '$ US Dollar (USD)' },
  { value: 'GBP', label: '£ British Pound (GBP)' },
  { value: 'EUR', label: '€ Euro (EUR)' },
  { value: 'KES', label: 'Ksh Kenyan Shilling (KES)' },
  { value: 'GHS', label: 'GH₵ Ghanaian Cedi (GHS)' },
  { value: 'ZAR', label: 'R South African Rand (ZAR)' },
];

const donationOptions = [
  { value: "2500", label: "₦2,500" },
  { value: "5000", label: "₦5,000" },
  { value: "10000", label: "₦10,000" },
  { value: "25000", label: "₦25,000" },
  { value: "custom", label: "Custom Amount" }
];

// Map of donation amounts to their corresponding Flutterwave plan IDs
const monthlyPlanIds: Record<string, string> = {
  // NGN plans (for local donations)
  "2500.00_NGN": "141145",
  "5000.00_NGN": "141146",
  "10000.00_NGN": "141147",
  "25000.00_NGN": "141148",

  // International plans (USD/EUR/GBP)
  "5.00_ALL": "141154",
  "10.00_ALL": "141158",
  "25.00_ALL": "141157"
};

// Amount options for different currencies
const monthlyAmounts = {
  NGN: ["2500.00", "5000.00", "10000.00", "25000.00"],
  USD: ["5.00", "10.00", "25.00"],
  EUR: ["5.00", "10.00", "25.00"],
  GBP: ["5.00", "10.00", "25.00"]
};

const Donate = () => {
  const [donationAmount, setDonationAmount] = useState("2500");
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donationCurrency, setDonationCurrency] = useState("NGN");
  const [loading, setLoading] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const { toast } = useToast();

  // Move getFlutterwaveConfig above the hooks
  const getFlutterwaveConfig = (planId?: string) => {
    const amount = donationAmount === "custom" ? customAmount : donationAmount;
    // No validation here; validation will be in handlers
    return {
      public_key: import.meta.env.VITE_FLW_PUBLIC_KEY,
      tx_ref: `donation-${Date.now()}`,
      amount: parseFloat(amount),
      currency: donationCurrency,
      payment_options: "card,banktransfer,ussd,mobilemoneyghana,mobilemoneyuganda,mobilemoneyrwanda,mobilemoneyzambia,mobilemoneytanzania,mobilemoneyza,mobilemoney",
      customer: {
        email: donorEmail,
        phone_number: donorPhone,
        name: donorName,
      },
      country: "NG",
      ...(planId ? { payment_plan: String(planId) } : {}),
      callback: (response: any) => {
        setLoading(false);
        setTransactionId(response.tx_ref);

        // Track donation in Google Analytics
        const amount = donationAmount === "custom" ? customAmount : donationAmount;
        trackDonation(parseFloat(amount), donationCurrency);

        // Track additional donation details
        trackEvent('donation_success', 'engagement', `${donationCurrency} ${amount}`, parseFloat(amount));

        toast({
          title: "Payment Successful!",
          description: `Thank you for your donation. Transaction ID: ${response.tx_ref}`,
        });
      },
      onClose: () => {
        setLoading(false);
      },
      customizations: {
        title: "Humanity Verse Donation",
        description: "Support our mission to help communities in need",
        logo: "https://humanityverseaidfoundation.netlify.app/logo.png",
      },
    };
  };

  // Initialize Flutterwave hooks
  const handleOneTimePayment = useFlutterwave(getFlutterwaveConfig());
  const handleMonthlyPayment = useFlutterwave(getFlutterwaveConfig(monthlyPlanIds[donationAmount]));

  const handleDonateNow = () => {
    const amount = donationAmount === "custom" ? customAmount : donationAmount;
    if (!amount || !donorName || !donorEmail || !donorPhone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    setLoading(true);
    handleOneTimePayment(getFlutterwaveConfig());
  };

  // Handler for monthly giving (recurring)
  const normalizeAmount = (amount: string) => parseFloat(amount).toFixed(2);

  const handleMonthlyGiving = () => {
    const amount = donationAmount;
    const normalizedAmount = normalizeAmount(amount);

    // Determine plan key based on currency
    const planKey = donationCurrency === 'NGN'
      ? `${normalizedAmount}_NGN`
      : `${normalizedAmount}_ALL`;

    const planId = monthlyPlanIds[planKey];

    // Debug log for troubleshooting
    console.log({
      amount,
      normalizedAmount,
      currency: donationCurrency,
      planKey,
      planId,
      allPlanIds: monthlyPlanIds
    });

    if (!amount || !donorName || !donorEmail || !donorPhone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Disallow custom amounts for monthly donations
    if (donationAmount === "custom") {
      toast({
        title: "Invalid Selection",
        description: "Monthly donations require selecting one of our preset amounts",
        variant: "destructive"
      });
      return;
    }

    if (!planId) {
      toast({
        title: "Invalid Amount",
        description: "Please select a valid monthly donation amount",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    handleMonthlyPayment(getFlutterwaveConfig(planId)); // Always pass as string
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = donationAmount === "custom" ? customAmount : donationAmount;

    if (!amount || !donorName || !donorEmail || !donorPhone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Format the amount with the selected currency
    let formattedAmount = amount;
    if (donationCurrency === 'NGN') {
      formattedAmount = `₦${parseInt(amount).toLocaleString()}`;
    } else if (donationCurrency === 'USD') {
      formattedAmount = `$${parseInt(amount).toLocaleString()}`;
    } else if (donationCurrency === 'GBP') {
      formattedAmount = `£${parseInt(amount).toLocaleString()}`;
    } else if (donationCurrency === 'EUR') {
      formattedAmount = `€${parseInt(amount).toLocaleString()}`;
    } else if (donationCurrency === 'KES') {
      formattedAmount = `Ksh${parseInt(amount).toLocaleString()}`;
    } else if (donationCurrency === 'GHS') {
      formattedAmount = `GH₵${parseInt(amount).toLocaleString()}`;
    } else if (donationCurrency === 'ZAR') {
      formattedAmount = `R${parseInt(amount).toLocaleString()}`;
    }

    // In a real app, this would process the payment
    toast({
      title: "Donation Successful!",
      description: `Thank you for your donation of ${formattedAmount}. A receipt has been sent to your email.`,
    });
  };

  return (
    <Layout>
      <section className="py-16 bg-gradient-to-br from-primary-100 to-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-brown-700">Make a Donation</h1>
            <p className="text-lg text-brown-600 mb-6">
              Your support helps us create sustainable solutions for communities in need worldwide.
            </p>
            <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
              <p className="text-lg font-medium text-brown-700 mb-4">You can send your donations to:</p>
              <div className="space-y-3 text-gray-700">
                <p><span className="font-medium">Account Name:</span> Humanity Verse Aid Foundation (HVAF)</p>
                <p><span className="font-medium">Bank:</span> Guaranty Trust Bank (GTB)</p>
                <div className="mt-4">
                  <p className="font-medium mb-2">Account Numbers:</p>
                  <div className="pl-4 space-y-1">
                    <p><span className="font-medium">NGN:</span> 3000788452</p>
                    <p><span className="font-medium">USD:</span> 3000788476</p>
                    <p><span className="font-medium">GBP:</span> 3000788713</p>
                    <p><span className="font-medium">EUR:</span> 3000788737</p>
                  </div>
                </div>
                <div className="mt-4 space-y-1">
                  <p><span className="font-medium">Swift Code:</span> GTBINGLA</p>
                  <p><span className="font-medium">Sort Code:</span> 058113143</p>
                </div>
              </div>
              <p className="mt-4 text-gray-600">Or use the payment gateway below.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-custom max-w-4xl">
          <Tabs
            defaultValue="onetime"
            className="w-full"
            onValueChange={(value) => {
              if (value === 'monthly') {
                if (donationAmount === 'custom') {
                  setDonationAmount('2500.00');
                }
                setDonationCurrency('NGN'); // Reset currency to NGN for monthly
              }
            }}
          >
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger
                  value="onetime"
                  className="text-lg py-2 px-6 data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  One-time Donation
                </TabsTrigger>
                <TabsTrigger
                  value="monthly"
                  className="text-lg py-2 px-6 data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  Monthly Giving
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <TabsContent value="onetime">
                <h2 className="text-2xl font-bold mb-6 text-brown-700">Make a One-time Donation</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label className="text-lg mb-2 block">Select an amount</Label>
                    <RadioGroup
                      value={donationAmount}
                      onValueChange={setDonationAmount}
                      className="grid grid-cols-2 sm:grid-cols-5 gap-4"
                    >
                      {donationOptions.map((option) => (
                        <div key={option.value} className="flex items-center">
                          <RadioGroupItem
                            value={option.value}
                            id={`amount-${option.value}`}
                            className="sr-only"
                          />
                          <Label
                            htmlFor={`amount-${option.value}`}
                            className={`w-full text-center py-3 px-4 rounded-md cursor-pointer border ${donationAmount === option.value
                              ? "bg-primary text-white border-primary"
                              : "bg-white hover:bg-neutral-100 border-neutral-200"
                              }`}
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {donationAmount === "custom" && (
                    <div className="space-y-4">
                      <div className="flex gap-4 items-center">
                        <div className="flex-1 relative">
                          <Label htmlFor="custom-amount" className="text-lg mb-2 block">Custom Amount</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                              {donationCurrency === 'NGN' ? '₦' :
                                donationCurrency === 'USD' ? '$' :
                                  donationCurrency === 'GBP' ? '£' :
                                    donationCurrency === 'EUR' ? '€' :
                                      donationCurrency === 'KES' ? 'Ksh' :
                                        donationCurrency === 'GHS' ? 'GH₵' :
                                          donationCurrency === 'ZAR' ? 'R' : ''}
                            </span>
                            <Input
                              type="number"
                              id="custom-amount"
                              value={customAmount}
                              onChange={(e) => setCustomAmount(e.target.value)}
                              placeholder="Enter amount"
                              className="pl-8"
                              min="1"
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <Label htmlFor="currency" className="text-lg mb-2 block">
                            Currency
                          </Label>
                          <Select
                            value={donationCurrency}
                            onValueChange={setDonationCurrency}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              {supportedCurrencies.map((currency) => (
                                <SelectItem
                                  key={currency.value}
                                  value={currency.value}
                                  className="hover:bg-primary hover:text-white"
                                >
                                  {currency.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="block mb-2">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="block mb-2">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Your email"
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="block mb-2">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Your phone number"
                        value={donorPhone}
                        onChange={(e) => setDonorPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Button
                      type="button"
                      className="w-full"
                      disabled={loading}
                      onClick={handleDonateNow}
                    >
                      {loading ? 'Processing...' : 'Donate Now'}
                    </Button>
                    {loading && (
                      <div className="text-center text-sm text-gray-500">
                        Processing payment...
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-center text-gray-500">
                    Your donation is securely processed. You will receive a receipt via email.
                  </p>
                </form>
              </TabsContent>

              <TabsContent value="monthly">
                <h2 className="text-2xl font-bold mb-6 text-brown-700">Become a Monthly Supporter</h2>
                <form onSubmit={(e) => { e.preventDefault(); handleMonthlyGiving(); }} className="space-y-6">
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <Label className="block mb-2">Currency</Label>
                        <Select
                          value={donationCurrency}
                          onValueChange={(value) => {
                            setDonationCurrency(value);
                            // Reset to first amount in the new currency
                            setDonationAmount(monthlyAmounts[value][0]);
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NGN">Nigerian Naira (₦)</SelectItem>
                            <SelectItem value="USD">US Dollar ($)</SelectItem>
                            <SelectItem value="EUR">Euro (€)</SelectItem>
                            <SelectItem value="GBP">British Pound (£)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Label className="text-lg mb-2 block">Select a monthly amount</Label>
                    <RadioGroup
                      value={donationAmount}
                      onValueChange={setDonationAmount}
                      className="grid grid-cols-2 sm:grid-cols-4 gap-4"
                    >
                      {monthlyAmounts[donationCurrency]?.map((amount) => (
                        <div key={amount} className="flex items-center">
                          <RadioGroupItem
                            value={amount}
                            id={`monthly-${amount}`}
                            className="sr-only"
                          />
                          <Label
                            htmlFor={`monthly-${amount}`}
                            className={`w-full text-center py-3 px-4 rounded-md cursor-pointer border ${donationAmount === amount
                              ? "bg-primary text-white border-primary"
                              : "bg-white hover:bg-neutral-100 border-neutral-200"
                              }`}
                          >
                            {donationCurrency === 'NGN' ? `₦${amount}` :
                              donationCurrency === 'USD' ? `$${amount}` :
                                donationCurrency === 'EUR' ? `€${amount}` :
                                  `£${amount}`}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {donationAmount === "custom" && (
                    <div className="space-y-4">
                      <div className="flex gap-4 items-center">
                        <div className="flex-1 relative">
                          <Label htmlFor="custom-monthly" className="text-lg mb-2 block">Custom Monthly Amount</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                              {donationCurrency === 'NGN' ? '₦' :
                                donationCurrency === 'USD' ? '$' :
                                  donationCurrency === 'GBP' ? '£' :
                                    donationCurrency === 'EUR' ? '€' :
                                      donationCurrency === 'KES' ? 'Ksh' :
                                        donationCurrency === 'GHS' ? 'GH₵' :
                                          donationCurrency === 'ZAR' ? 'R' : ''}
                            </span>
                            <Input
                              type="number"
                              id="custom-monthly"
                              value={customAmount}
                              onChange={(e) => setCustomAmount(e.target.value)}
                              placeholder="Enter amount"
                              className="pl-8"
                              min="1"
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <Label htmlFor="currency-monthly" className="text-lg mb-2 block">
                            Currency
                          </Label>
                          <Select
                            value={donationCurrency}
                            onValueChange={setDonationCurrency}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              {supportedCurrencies.map((currency) => (
                                <SelectItem
                                  key={currency.value}
                                  value={currency.value}
                                  className="hover:bg-primary hover:text-white"
                                >
                                  {currency.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name-monthly" className="block mb-2">Full Name</Label>
                      <Input
                        id="name-monthly"
                        placeholder="Your name"
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email-monthly" className="block mb-2">Email Address</Label>
                      <Input
                        id="email-monthly"
                        type="email"
                        placeholder="Your email"
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone-monthly" className="block mb-2">Phone Number</Label>
                      <Input
                        id="phone-monthly"
                        type="tel"
                        placeholder="Your phone number"
                        value={donorPhone}
                        onChange={(e) => setDonorPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    className="w-full bg-primary hover:bg-primary-600 py-6 text-lg"
                    disabled={loading}
                    onClick={handleMonthlyGiving}
                  >
                    {loading ? 'Processing...' : 'Start Monthly Giving'}
                  </Button>

                  <p className="text-sm text-center text-gray-500">
                    You can cancel your monthly donation at any time. Your support helps us plan for the future.
                  </p>
                </form>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </section>

      <section className="py-16 bg-neutral-100">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-10 text-center text-brown-700">Your Impact</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-xl text-primary">$25</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-brown-600">
                  Provides clean water to a family for one month
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-xl text-primary">$50</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-brown-600">
                  Provides school supplies for five children
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-xl text-primary">$100</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-brown-600">
                  Provides emergency food for a family for two weeks
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-6">Other Ways to Support</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            There are many ways you can support our mission beyond monetary donations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 p-6 rounded-lg">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-white text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Volunteer</h3>
              <p className="text-white/90">
                Share your time and skills to help communities in need.
              </p>
            </div>

            <div className="bg-white/10 p-6 rounded-lg">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-white text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Corporate Partnerships</h3>
              <p className="text-white/90">
                Create meaningful partnerships that benefit both parties.
              </p>
            </div>

            <div className="bg-white/10 p-6 rounded-lg">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-white text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Spread Awareness</h3>
              <p className="text-white/90">
                Share our work with your network to amplify our impact.
              </p>
            </div>
          </div>

          <Button asChild variant="outline" size="lg" className="mt-8 border-white hover:bg-white text-[#000] hover:text-primary">
            <a href="/contact">Get in Touch</a>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Donate;
