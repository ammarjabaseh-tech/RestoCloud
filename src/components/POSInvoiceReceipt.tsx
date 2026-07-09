import React from 'react';
import { Tenant, Order } from '../types';
import { RestaurantLogo } from './RestaurantLogo';

interface POSInvoiceReceiptProps {
  tenant: Tenant;
  order: Order | null;
  isDraft?: boolean;
}

export const POSInvoiceReceipt: React.FC<POSInvoiceReceiptProps> = ({
  tenant,
  order,
  isDraft = false
}) => {
  if (!order) return null;

  return (
    <div className="receipt-print-box text-slate-900 bg-white mx-auto p-4 font-mono text-xs w-full max-w-[320px] select-none" dir="rtl">
      {/* Restaurant Header */}
      <div className="text-center space-y-1 pb-3 border-b-2 border-dashed border-slate-400">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-900 text-2xl flex items-center justify-center mx-auto mb-2 border border-slate-300 font-sans print:border-slate-800">
          <RestaurantLogo logo={tenant.logo} />
        </div>
        <h2 className="font-black text-base sm:text-lg font-sans tracking-tight text-slate-950">{tenant.nameAr}</h2>
        {tenant.slogan && <p className="text-[11px] text-slate-600 font-sans">{tenant.slogan}</p>}
        <p className="text-[11px] text-slate-600 font-sans">{tenant.address}</p>
        <p className="text-[11px] text-slate-600" dir="ltr">Tel: {tenant.phone}</p>
        
        <div className="pt-1.5 flex items-center justify-center gap-1 text-[11px] font-bold text-slate-800 font-sans">
          <span>الرقم الضريبي:</span>
          <span className="font-mono tracking-wider">300123456700003</span>
        </div>

        <div className="pt-2">
          {isDraft ? (
            <div className="border-2 border-dashed border-amber-600 bg-amber-50 text-amber-900 font-black px-2 py-1 rounded text-center text-xs font-sans">
              ★ فاتورة مبدئية للمراجعة (DRAFT) ★
            </div>
          ) : (
            <div className="border border-slate-800 bg-slate-900 text-white font-bold px-2 py-1 rounded text-center text-xs font-sans print:bg-black print:text-white print:border-black">
              فاتورة ضريبية مبسطة (Simplified Tax Invoice)
            </div>
          )}
        </div>
      </div>

      {/* Order Info & Metadata */}
      <div className="py-2.5 border-b border-dashed border-slate-300 space-y-1 text-[11px] font-sans">
        <div className="flex justify-between font-bold text-slate-900">
          <span>رقم الفاتورة:</span>
          <span className="font-mono font-black text-xs text-emerald-700 print:text-black">{order.orderNumber}</span>
        </div>
        <div className="flex justify-between">
          <span>التاريخ والوقت:</span>
          <span className="font-mono" dir="ltr">{order.createdAt}</span>
        </div>
        <div className="flex justify-between">
          <span>نوع الطلب:</span>
          <span className="font-bold">
            {order.orderType === "dine_in" 
              ? `محلي (طاولة رقم ${order.tableNumber || 1})` 
              : order.orderType === "takeaway" 
              ? "سفري (Takeaway)" 
              : "توصيل (Delivery)"}
          </span>
        </div>
        {order.customerName && (
          <div className="flex justify-between">
            <span>العميل:</span>
            <span>{order.customerName}</span>
          </div>
        )}
        <div className="flex justify-between text-slate-600">
          <span>الكاشير:</span>
          <span>{order.cashierName || "الكاشير العام"}</span>
        </div>
      </div>

      {/* Items Table */}
      <div className="py-2.5 border-b-2 border-dashed border-slate-400 font-sans">
        <div className="grid grid-cols-12 gap-1 text-[11px] font-bold text-slate-900 border-b border-slate-300 pb-1.5 mb-1.5">
          <span className="col-span-6">الصنف</span>
          <span className="col-span-2 text-center">الكمية</span>
          <span className="col-span-2 text-center">السعر</span>
          <span className="col-span-2 text-left">الإجمالي</span>
        </div>

        <div className="space-y-2">
          {order.items.map((item, idx) => (
            <div key={idx} className="text-[11px]">
              <div className="grid grid-cols-12 gap-1 items-start text-slate-800">
                <span className="col-span-6 font-semibold leading-tight">{item.nameAr}</span>
                <span className="col-span-2 text-center font-mono font-bold">{item.quantity}</span>
                <span className="col-span-2 text-center font-mono text-slate-600">{item.price}</span>
                <span className="col-span-2 text-left font-mono font-bold text-slate-900">
                  {(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
              {item.notes && (
                <div className="text-[10px] text-slate-500 italic pr-2 mt-0.5">
                  * {item.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Financial Summary */}
      <div className="py-2.5 space-y-1.5 text-xs font-sans">
        <div className="flex justify-between text-slate-700">
          <span>المجموع الفرعي (Subtotal):</span>
          <span className="font-mono font-semibold">{order.subtotal.toFixed(2)} {tenant.currency}</span>
        </div>
        <div className="flex justify-between text-slate-700">
          <span>ضريبة القيمة المضافة ({tenant.taxRate}%):</span>
          <span className="font-mono font-semibold">{order.taxAmount.toFixed(2)} {tenant.currency}</span>
        </div>
        {order.discountAmount > 0 && (
          <div className="flex justify-between text-rose-600 font-semibold print:text-black">
            <span>خصم ترويجي:</span>
            <span className="font-mono">- {order.discountAmount.toFixed(2)} {tenant.currency}</span>
          </div>
        )}
        
        {/* Total Payable Box */}
        <div className="flex justify-between items-center bg-slate-100 border border-slate-300 p-2 rounded-lg font-black text-sm text-slate-950 my-2 print:bg-white print:border-2 print:border-black">
          <span>الإجمالي النهائي (Total):</span>
          <span className="font-mono text-base">{order.total.toFixed(2)} {tenant.currency}</span>
        </div>

        <div className="flex justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-200">
          <span>طريقة الدفع:</span>
          <span className="font-bold text-slate-800">
            {order.paymentMethod === 'cash' ? 'نقدي (Cash)' : order.paymentMethod === 'card' ? 'شبكة / بطاقة بنكية' : order.paymentMethod === 'credit' ? 'آجل / حساب عميل' : 'معلق للمراجعة'}
          </span>
        </div>
        <div className="flex justify-between text-[11px] text-slate-600">
          <span>حالة السداد:</span>
          <span className="font-bold text-slate-800">
            {order.paymentStatus === 'paid' ? 'مدفوعة بنجاح ✓' : order.paymentStatus === 'refunded' ? 'مستردة (Refunded)' : 'غير مدفوعة (Pending)'}
          </span>
        </div>
      </div>

      {/* ZATCA QR & Footer */}
      <div className="pt-3 border-t-2 border-dashed border-slate-400 text-center space-y-2 font-sans">
        <div className="w-28 h-28 mx-auto p-2 bg-white border-2 border-slate-900 rounded-xl flex flex-col items-center justify-center relative print:border-black">
          {/* Simulated ZATCA QR Code Pattern */}
          <div className="grid grid-cols-5 gap-0.5 w-full h-full p-1 bg-slate-50 border border-slate-200">
            {Array.from({ length: 25 }).map((_, i) => (
              <div 
                key={i} 
                className={`w-full h-full ${
                  i === 0 || i === 4 || i === 20 || i === 24 || i === 12 || (i % 3 === 0 && i !== 15)
                    ? 'bg-slate-950' 
                    : 'bg-transparent'
                }`} 
              />
            ))}
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-white/95 px-1.5 py-0.5 text-[9px] font-black border border-slate-800 rounded shadow-xs text-slate-950">
              ZATCA
            </span>
          </div>
        </div>

        <p className="text-[11px] font-bold text-slate-800">شكراً لزيارتكم! نتمنى لكم أطيب الأوقات</p>
        <p className="text-[10px] text-slate-500 font-mono" dir="ltr">Powered by RestoCloud POS v2.5</p>
      </div>
    </div>
  );
};
