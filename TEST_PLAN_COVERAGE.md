# RFQ API Test Coverage Plan

---

## Get Quote

### Positive Scenarios
- Happy path
- Valid quote using `deliverQuantity`
- Valid quote using `receiveQuantity`
- Buy quote
- Sell quote
- Schema validation
- Response time validation

### Input Validation
- Quantity exceeds maximum limit
- Quantity below minimum limit
  - **Note:** Minimum trade size is product-dependent and varies by trading pair. Test assertions validate the API response rather than assuming a universal minimum.
  - **Note:** Test pairs were selected to exercise both base and quote currency validation paths across buy and sell scenarios.
- Negative quantities
- Non-numeric quantities
- Missing quantity
- Invalid ticker
  - **Observation:** The API returns **403 Forbidden** with *"Product Not Supported"*. A **400 Bad Request** would more accurately represent invalid client input.
- Invalid trade side
- Invalid payload
  - **Observation:** The error wording for missing quantity could be clearer, particularly the final phrase of the message.
- Missing required payload
- Both `deliverQuantity` and `receiveQuantity` supplied
- Missing required fields
- Precision validation
  - Deliver quantity precision
  - Receive quantity precision
  - Buy scenarios
  - Sell scenarios
  - Quote currency (USD)

### Business Rules
- Quote time validation
  - **Note:** Allow up to **5 second** of clock drift since timestamps are generated server-side and network latency may delay the client's receipt of the response.
- Quote expiry window validation (8-second TTL)


---

## Create Quote

### Positive Scenarios
- Happy path
- Schema validation
- Response time validation

### Request Variations
- Quote using `receiveQuantity`
- Quote using `deliverQuantity`
- Reject both quantities supplied

### Business Validation
- Insufficient funds
- Exceeds maximum trade limit

### Optional Fields
- Username reference omitted
- Username reference fewer than 64 characters
- Username reference exactly 64 characters
- Username reference with special characters

### Required Fields
- Missing mandatory fields
  - Account ID
  - Ticker
  - Trade side
  - Quantity

### Invalid Inputs
- Invalid ticker
- Invalid trade side
- Invalid quantity
- Invalid account ID
- Invalid username reference

---

## Execute Quote

### Positive Scenarios
- Happy path
- Schema validation
- Response time validation
- Trade date validation
- Value date occurs after trade date

### Negative Scenarios
- Execute an already executed quote
- Execute an expired quote
- Execute a non-existent quote
- Missing quote ID

---

## Expire Quote

### Positive Scenarios
- Happy path
- Schema validation
- Response time validation

### Negative Scenarios
- Expire an already executed quote
- Expire an already expired quote
- Expire a naturally expired quote (TTL)
- Expire a non-existent quote
- Missing quote ID

---

## General Notes
- Totals to around 60 +testcases.
- JSON Schema validation is used to verify API contracts.
- Both positive and negative scenarios are covered for each endpoint.
- Business rules are validated in addition to HTTP status codes.
- Data-driven testing is used where appropriate to reduce duplication and improve maintainability.
- API version differences (v1 vs. v2) were identified during testing, including schema differences (`payload` /  `data`), validation behavior, and error response structures.