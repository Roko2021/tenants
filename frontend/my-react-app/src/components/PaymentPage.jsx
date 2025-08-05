import React from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';

const PaymentPage = () => {
  return (
    <div>
      <h2>صفحة الدفع</h2>
      {/* ... معلومات الطلب الأخرى ... */}
      <PayPalButtons
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: "10.00", // استبدل هذا بقيمة الطلب الديناميكية
                  currency: "USD",
                },
              },
            ],
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then((details) => {
            alert("تم الدفع بنجاح بواسطة: " + details.payer.name.given_name);
            // يمكنك هنا إرسال تفاصيل الدفع إلى الخادم الخاص بك لتأكيد الطلب
          });
        }}
        onError={(err) => {
          console.error("حدث خطأ في دفع PayPal:", err);
          alert("حدث خطأ أثناء معالجة الدفع. يرجى المحاولة مرة أخرى.");
        }}
      />
    </div>
  );
};

export default PaymentPage;