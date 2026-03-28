# Philippine Price Data Sources

This document explains how to integrate public data sources for automatic price updates.

## Available Public Data Sources

### 1. Philippine Statistics Authority (PSA)
- **Website**: https://psa.gov.ph/price-indices/cpi-ir
- **Data**: Consumer Price Index and retail prices of commodities
- **Update Frequency**: Monthly
- **API**: Not publicly available (manual data collection required)

### 2. Department of Agriculture (DA)
- **Website**: https://www.da.gov.ph/
- **Bantay Presyo**: https://www.da.gov.ph/bantay-presyo/
- **Data**: Daily prices of agricultural commodities in major markets
- **Update Frequency**: Daily
- **API**: Limited (manual scraping may be needed)

### 3. OpenPrices Philippines (Community Initiative)
- **Data**: Community-sourced prices from various markets
- **Update Frequency**: Varies by contributor
- **API**: Depends on implementation

## Using the Update Price API

### Edge Function Endpoint

```
POST https://dgzcslcqvigvdqahjidd.supabase.co/functions/v1/update-prices
```

### Authentication

Include your Supabase anon key in the Authorization header:

```javascript
headers: {
  'Authorization': 'Bearer YOUR_SUPABASE_ANON_KEY',
  'Content-Type': 'application/json'
}
```

### Update Single Price

```json
{
  "product_id": "product-uuid-here",
  "price": 125.50,
  "source": "Department of Agriculture",
  "location": "Quezon City Market",
  "recorded_at": "2024-03-28T10:00:00Z"
}
```

### Update Multiple Prices

```json
[
  {
    "product_id": "product-uuid-1",
    "price": 125.50,
    "source": "DA Bantay Presyo"
  },
  {
    "product_id": "product-uuid-2",
    "price": 85.00,
    "source": "DA Bantay Presyo"
  }
]
```

## Setting Up Automated Updates

### Option 1: Manual Data Entry

Use the edge function to manually submit price updates from trusted sources.

### Option 2: Web Scraping (Daily Updates)

Create a scheduled task that:
1. Scrapes data from DA Bantay Presyo website
2. Parses the price information
3. Calls the update-prices edge function
4. Runs daily via cron job or GitHub Actions

Example implementation needed:
- Python/Node.js scraper script
- Schedule using cron or GitHub Actions workflow
- Error handling and logging

### Option 3: API Integration (If Available)

If DA or PSA provides an API in the future:
1. Register for API access
2. Create scheduled function to fetch data
3. Transform data to match our schema
4. Call update-prices endpoint

### Option 4: Community Crowdsourcing

Create a form interface where users can submit prices they observe at their local markets:
1. Add authentication to ensure data quality
2. Implement verification system
3. Allow community members to report prices
4. Moderate submissions before accepting

## Data Quality Considerations

1. **Source Verification**: Always verify the data source is legitimate
2. **Outlier Detection**: Implement checks for unusual price changes
3. **Geographic Accuracy**: Ensure location data is accurate
4. **Timestamp Accuracy**: Use correct timezone (Philippine Time)
5. **Regular Audits**: Periodically review price data for accuracy

## Recommended Approach

For daily automated updates:

1. **Primary Source**: DA Bantay Presyo (daily updates)
2. **Secondary Source**: PSA data (monthly verification)
3. **Community Input**: Optional crowdsourced data with moderation

## Next Steps

1. Develop a web scraper for DA Bantay Presyo
2. Set up scheduled task (GitHub Actions or server cron)
3. Implement data validation and quality checks
4. Add monitoring and alerting for failed updates
5. Create admin dashboard for data management
