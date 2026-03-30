export default function Payment() {
  return (
    <div className="page payment-page">
      <h1>Payment</h1>
      <p className="payment-intro">
        Payment can be sent via Venmo or Zelle. Please include your house name in the payment memo.
      </p>

      <div className="payment-methods">
        <div className="payment-card">
          <h2>Venmo</h2>
          <p className="payment-handle">@PapaPinkys</p>
          <p className="payment-note">Include your house name in the note.</p>
        </div>

        <div className="payment-card">
          <h2>Zelle</h2>
          <p className="payment-handle">papapinkys@email.com</p>
          <p className="payment-note">Include your house name in the memo.</p>
        </div>
      </div>

      <p className="payment-disclaimer">
        Payment details shown above are placeholders. Contact Papa Pinky Meal Service directly for confirmed payment information.
      </p>
    </div>
  );
}
