(function () {
  const buyButtonId = 'buy_btn_1UDSGrPOZC1t2VPzK2h287wr';
  const publishableKey = 'pk_live_51UDR4DPOZC1t2VPzkmCGmwYS6T2xv2a9H7nW4WgZjAjzeEu4ndrJ2ql314dub4plGBvPPRpobliSXJtIJH5SH36L00KUtg3tf0';

  function mountStripeButton() {
    const paymentSide = document.querySelector('#payment .payment-side');
    if (!paymentSide || paymentSide.querySelector('stripe-buy-button')) return;

    paymentSide.innerHTML = '';

    const message = document.createElement('p');
    message.textContent = 'Secure checkout is provided by Stripe. This website does not store card details.';

    const button = document.createElement('stripe-buy-button');
    button.setAttribute('buy-button-id', buyButtonId);
    button.setAttribute('publishable-key', publishableKey);
    button.style.display = 'block';
    button.style.marginTop = '22px';

    paymentSide.append(message, button);
  }

  if (!document.querySelector('script[src="https://js.stripe.com/v3/buy-button.js"]')) {
    const stripeScript = document.createElement('script');
    stripeScript.src = 'https://js.stripe.com/v3/buy-button.js';
    stripeScript.async = true;
    document.head.appendChild(stripeScript);
  }

  document.addEventListener('DOMContentLoaded', mountStripeButton);
  window.addEventListener('load', mountStripeButton);
  setTimeout(mountStripeButton, 1200);

  const observer = new MutationObserver(mountStripeButton);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  setTimeout(() => observer.disconnect(), 5000);
})();
