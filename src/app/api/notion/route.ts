
import { Client } from '@notionhq/client';
import { NextResponse } from 'next/server';
import type { StockItem } from '@/app/notion-table/page';

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const databaseId = process.env.NOTION_DATABASE_ID;

// This function converts Notion's complex page object into a simpler StockItem object.
// You will likely need to adjust the property names ('Name', 'Stock', 'Price', 'Status')
// to match the exact names of the columns in YOUR Notion database.
function pageToStockItem(page: any): StockItem | null {
  try {
    const name = page.properties.Name?.title?.[0]?.plain_text ?? 'Untitled';
    const stock = page.properties.Stock?.number ?? 0;
    const price = page.properties.Price?.number ?? 0;
    const status = page.properties.Status?.select?.name ?? 'Out of Stock';

    // Basic validation
    if (typeof stock !== 'number' || typeof price !== 'number') {
        return null;
    }

    // Type assertion for status
    const validStatus = ['In Stock', 'Low Stock', 'Out of Stock'].includes(status) 
        ? status as StockItem['status'] 
        : 'Out of Stock';

    return {
      id: page.id,
      name,
      stock,
      price,
      status: validStatus,
    };
  } catch (error) {
    console.error(`Failed to process page ${page.id}:`, error);
    return null; // Skip this item if it has a malformed structure
  }
}

export async function GET() {
  if (!databaseId || !process.env.NOTION_API_KEY) {
    return NextResponse.json({ error: 'Notion API Key or Database ID is not configured.' }, { status: 500 });
  }

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      // You can add sorts here if needed
      sorts: [
        {
          property: 'Name',
          direction: 'ascending',
        },
      ],
    });

    const stockItems = response.results
      .map(pageToStockItem)
      .filter((item): item is StockItem => item !== null); // Filter out any null (malformed) items

    return NextResponse.json(stockItems);

  } catch (error: any) {
    console.error('Notion API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch data from Notion.' }, { status: 500 });
  }
}
