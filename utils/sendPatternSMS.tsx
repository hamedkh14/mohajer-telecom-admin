interface SendPatternSMSProps {
  patternCode: string;
  recipient: string;
  variables: Record<string, string>;
  smsSettings: Record<string, string>;
}

export async function sendPatternSMS({
  patternCode,
  recipient,
  variables,
  smsSettings
}: SendPatternSMSProps) {
  const url = "https://api2.ippanel.com/api/v1/sms/pattern/normal/send";
console.log(recipient);
  const payload = {
    code: smsSettings?.[patternCode],
    sender: smsSettings?.sender,
    recipient: '0' + recipient,
    variable: variables
  };
console.log(payload);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "accept": "*/*",
        "apikey": smsSettings?.apikey ?? '',
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });    
console.log(response);
    // const result = await response.json();
    // return result;
  } catch (error: any) {
    console.error("SMS API Error:", error);
    return { status: "ERROR", errorMessage: error.message };
  }
}