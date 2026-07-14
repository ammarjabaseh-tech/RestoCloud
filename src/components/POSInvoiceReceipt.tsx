import React from 'react';
import { Tenant, Order } from '../types';
import { RestaurantLogo } from './RestaurantLogo';

interface POSInvoiceReceiptProps {
  tenant: Tenant;
  order: Order | null;
  isDraft?: boolean;
  lang?: 'ar' | 'en' | 'tr';
}

export const POSInvoiceReceipt: React.FC<POSInvoiceReceiptProps> = ({
  tenant,
  order,
  isDraft = false,
  lang = 'ar'
}) => {
  if (!order) return null;

  return (
    <div className="receipt-print-box text-slate-900 bg-white mx-auto p-4 font-mono text-xs w-full max-w-[320px] select-none" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Restaurant Header */}
      <div className="text-center space-y-1 pb-3 border-b-2 border-dashed border-slate-400">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-900 text-2xl flex items-center justify-center mx-auto mb-2 border border-slate-300 font-sans print:border-slate-800">
          <RestaurantLogo logo={tenant.logo} />
        </div>
        <h2 className="font-black text-base sm:text-lg font-sans tracking-tight text-slate-950">
          {lang === 'ar' ? tenant.nameAr : (lang === 'tr' && tenant.nameTr ? tenant.nameTr : tenant.nameAr)}
        </h2>
        {tenant.slogan && <p className="text-[11px] text-slate-600 font-sans">{tenant.slogan}</p>}
        <p className="text-[11px] text-slate-600 font-sans">{tenant.address}</p>
        <p className="text-[11px] text-slate-600" dir="ltr">Tel: {tenant.phone}</p>
        
        <div className="pt-1.5 flex items-center justify-center gap-1 text-[11px] font-bold text-slate-800 font-sans">
          <span>{lang === 'ar' ? 'الرقم الضريبي:' : lang === 'tr' ? 'Vergi No:' : 'VAT Number:'}</span>
          <span className="font-mono tracking-wider">300123456700003</span>
        </div>

        <div className="pt-2">
          {isDraft ? (
            <div className="border-2 border-dashed border-amber-600 bg-amber-50 text-amber-900 font-black px-2 py-1 rounded text-center text-xs font-sans">
              {lang === 'ar' ? '★ فاتورة مبدئية للمراجعة (DRAFT) ★' : lang === 'tr' ? '★ ÖN FATURA (TASLAK) ★' : '★ DRAFT INVOICE (PREVIEW) ★'}
            </div>
          ) : (
            <div className="border border-slate-800 bg-slate-900 text-white font-bold px-2 py-1 rounded text-center text-xs font-sans print:bg-black print:text-white print:border-black">
              {lang === 'ar' ? 'فاتورة ضريبية مبسطة (Simplified Tax Invoice)' : lang === 'tr' ? 'Basitleştirilmiş Vergi Faturası' : 'Simplified Tax Invoice'}
            </div>
          )}
        </div>
      </div>

      {/* Order Info & Metadata */}
      <div className="py-2.5 border-b border-dashed border-slate-300 space-y-1 text-[11px] font-sans">
        <div className="flex justify-between font-bold text-slate-900">
          <span>{lang === 'ar' ? 'رقم الفاتورة:' : lang === 'tr' ? 'Fatura No:' : 'Invoice No:'}</span>
          <span className="font-mono font-black text-xs text-emerald-700 print:text-black">{order.orderNumber}</span>
        </div>
        <div className="flex justify-between">
          <span>{lang === 'ar' ? 'التاريخ والوقت:' : lang === 'tr' ? 'Tarih ve Saat:' : 'Date & Time:'}</span>
          <span className="font-mono" dir="ltr">{order.createdAt}</span>
        </div>
        <div className="flex justify-between">
          <span>{lang === 'ar' ? 'نوع الطلب:' : lang === 'tr' ? 'Sipariş Tipi:' : 'Order Type:'}</span>
          <span className="font-bold">
            {order.orderType === "dine_in" 
              ? (lang === 'ar' ? `محلي (طاولة رقم ${order.tableNumber || 1})` : lang === 'tr' ? `Masa Servisi (Masa ${order.tableNumber || 1})` : `Dine In (Table ${order.tableNumber || 1})`)
              : order.orderType === "takeaway" 
              ? (lang === 'ar' ? "سفري" : lang === 'tr' ? "Gel-Al (Takeaway)" : "Takeaway") 
              : (lang === 'ar' ? "توصيل" : lang === 'tr' ? "Paket Servis (Delivery)" : "Delivery")}
          </span>
        </div>
        {order.customerName && (
          <div className="flex justify-between">
            <span>{lang === 'ar' ? 'العميل:' : lang === 'tr' ? 'Müşteri:' : 'Customer:'}</span>
            <span>{order.customerName}</span>
          </div>
        )}
        <div className="flex justify-between text-slate-600">
          <span>{lang === 'ar' ? 'الكاشير:' : lang === 'tr' ? 'Kasiyer:' : 'Cashier:'}</span>
          <span>{order.cashierName || (lang === 'ar' ? "الكاشير العام" : lang === 'tr' ? "Genel Kasiyer" : "General Cashier")}</span>
        </div>
      </div>

      {/* Items Table */}
      <div className="py-2.5 border-b-2 border-dashed border-slate-400 font-sans">
        <div className="grid grid-cols-12 gap-1 text-[11px] font-bold text-slate-900 border-b border-slate-300 pb-1.5 mb-1.5">
          <span className="col-span-6">{lang === 'ar' ? 'الصنف' : lang === 'tr' ? 'Ürün' : 'Item'}</span>
          <span className="col-span-2 text-center">{lang === 'ar' ? 'الكمية' : lang === 'tr' ? 'Adet' : 'Qty'}</span>
          <span className="col-span-2 text-center">{lang === 'ar' ? 'السعر' : lang === 'tr' ? 'Fiyat' : 'Price'}</span>
          <span className="col-span-2 text-left">{lang === 'ar' ? 'الإجمالي' : lang === 'tr' ? 'Tutar' : 'Total'}</span>
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
          <span>{lang === 'ar' ? 'المجموع الفرعي (Subtotal):' : lang === 'tr' ? 'Ara Toplam (Subtotal):' : 'Subtotal:'}</span>
          <span className="font-mono font-semibold">{order.subtotal.toFixed(2)} {tenant.currency}</span>
        </div>
        <div className="flex justify-between text-slate-700">
          <span>{lang === 'ar' ? `ضريبة القيمة المضافة (${tenant.taxRate}%):` : lang === 'tr' ? `KDV (${tenant.taxRate}%):` : `VAT (${tenant.taxRate}%):`}</span>
          <span className="font-mono font-semibold">{order.taxAmount.toFixed(2)} {tenant.currency}</span>
        </div>
        {order.discountAmount > 0 && (
          <div className="flex justify-between text-rose-600 font-semibold print:text-black">
            <span>{lang === 'ar' ? 'خصم ترويجي:' : lang === 'tr' ? 'İndirim:' : 'Discount:'}</span>
            <span className="font-mono">- {order.discountAmount.toFixed(2)} {tenant.currency}</span>
          </div>
        )}
        
        {/* Total Payable Box */}
        <div className="flex justify-between items-center bg-slate-100 border border-slate-300 p-2 rounded-lg font-black text-sm text-slate-950 my-2 print:bg-white print:border-2 print:border-black">
          <span>{lang === 'ar' ? 'الإجمالي النهائي (Total):' : lang === 'tr' ? 'Genel Toplam (Total):' : 'Total Payable:'}</span>
          <span className="font-mono text-base">{order.total.toFixed(2)} {tenant.currency}</span>
        </div>

        <div className="flex justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-200">
          <span>{lang === 'ar' ? 'طريقة الدفع:' : lang === 'tr' ? 'Ödeme Yöntemi:' : 'Payment Method:'}</span>
          <span className="font-bold text-slate-800">
            {order.paymentMethod === 'cash' 
              ? (lang === 'ar' ? 'نقدي (Cash)' : lang === 'tr' ? 'Nakit' : 'Cash') 
              : order.paymentMethod === 'card' 
              ? (lang === 'ar' ? 'شبكة / بطاقة بنكية' : lang === 'tr' ? 'Kart / POS Cihazı' : 'Card') 
              : order.paymentMethod === 'pending' 
              ? (lang === 'ar' ? 'معلق للمراجعة' : lang === 'tr' ? 'Bekleyen Onay' : 'Pending Approval') 
              : (lang === 'ar' ? 'آجل / حساب عميل' : lang === 'tr' ? 'Veresiye / Cari' : 'Deferred')}
          </span>
        </div>
        <div className="flex justify-between text-[11px] text-slate-600">
          <span>{lang === 'ar' ? 'حالة السداد:' : lang === 'tr' ? 'Ödeme Durumu:' : 'Payment Status:'}</span>
          <span className="font-bold text-slate-800">
            {order.paymentStatus === 'paid' 
              ? (lang === 'ar' ? 'مدفوعة بنجاح ✓' : lang === 'tr' ? 'Ödendi ✓' : 'Paid ✓') 
              : order.paymentStatus === 'refunded' 
              ? (lang === 'ar' ? 'مستردة (Refunded)' : lang === 'tr' ? 'İade Edildi' : 'Refunded') 
              : (lang === 'ar' ? 'غير مدفوعة (Pending)' : lang === 'tr' ? 'Ödenmedi (Beklemede)' : 'Unpaid (Pending)')}
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

        <p className="text-[11px] font-bold text-slate-800">
          {lang === 'ar' ? 'شكراً لزيارتكم! نتمنى لكم أطيب الأوقات' : lang === 'tr' ? 'Bizi tercih ettiğiniz için teşekkür ederiz!' : 'Thank you for your visit! Have a wonderful time'}
        </p>
        <p className="text-[10px] text-slate-500 font-mono" dir="ltr">Powered by RestoCloud POS v2.5</p>
      </div>
    </div>
  );
};
