
import { Client } from '@notionhq/client';
import { NextResponse, type NextRequest } from 'next/server';
import type { StockItem } from '@/app/notion-table/page';

// --- CONFIGURATION ---
// IMPORTANT: Replace these strings with the actual property names from your Notion database.
// These are case-sensitive.
const PROPERTY_NAMES = {
  name: 'Name',
  stock: 'Stock',
  price: 'Price',
  status: 'Status',
};
// ---------------------


// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const databaseId = process.env.NOTION_DATABASE_ID!;

// This function converts Notion's complex page object into a simpler StockItem object.
function pageToStockItem(page: any): StockItem | null {
  try {
    // Helper to get plain text from different property types
    const getPlainText = (property: any, type: 'rich_text' | 'title' | 'select') => {
        if (!property) return '';
        if (type === 'select') return property.select?.name ?? '';
        const arr = property[type];
        if (arr && arr.length > 0) {
            return arr[0]?.plain_text ?? '';
        }
        return '';
    };
    
    const name = getPlainText(page.properties[PROPERTY_NAMES.name], 'title');
    const stockText = getPlainText(page.properties[PROPERTY_NAMES.stock], 'rich_text');
    const priceText = getPlainText(page.properties[PROPERTY_NAMES.price], 'rich_text');
    
    // Status can be 'select' or 'rich_text'
    let status = getPlainText(page.properties[PROPERTY_NAMES.status], 'select');
    if (!status) {
       status = getPlainText(page.properties[PROPERTY_NAMES.status], 'rich_text');
    }

    const stock = Number(stockText) || 0;
    const price = Number(priceText) || 0;

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
    return null;
  }
}

// GET: Fetch all pages
export async function GET() {
  if (!databaseId || !process.env.NOTION_API_KEY) {
    return NextResponse.json({ error: 'Notion API Key or Database ID is not configured.' }, { status: 500 });
  }

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          property: PROPERTY_NAMES.name,
          direction: 'ascending',
        },
      ],
    });

    const stockItems = response.results
      .map(pageToStockItem)
      .filter((item): item is StockItem => item !== null);

    return NextResponse.json(stockItems);

  } catch (error: any) {
    console.error('Notion API Error (GET):', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch data from Notion.' }, { status: 500 });
  }
}


// POST: Create a new page
export async function POST(req: NextRequest) {
  try {
    const { name, stock, price, status } = await req.json();

    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        [PROPERTY_NAMES.name]: { title: [{ text: { content: name } }] },
        // Send data as strings inside rich_text objects
        [PROPERTY_NAMES.stock]: { rich_text: [{ text: { content: String(stock) } }] },
        [PROPERTY_NAMES.price]: { rich_text: [{ text: { content: String(price) } }] },
        // Try to create as select, but have a fallback to rich_text if you change the type
        [PROPERTY_NAMES.status]: { select: { name: status } },
      },
    });

    const newItem = pageToStockItem(response);
    return NextResponse.json(newItem, { status: 201 });

  } catch (error: any)
{
    console.error('Notion API Error (POST):', error);
    if (error.code === 'validation_error') {
        const message = error.body?.message || 'Validation error. Check if property types in Notion match the app.';
        if (message.includes("is not a valid select option")) {
             return NextResponse.json({ error: `"${error.body.message.split('"')[1]}" is not a valid option for the 'Status' column in Notion. Please add it as an option in your database.` }, { status: 400 });
        }
        return NextResponse.json({ error: message }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Failed to create item in Notion.' }, { status: 500 });
  }
}

// PATCH: Update an existing page
export async function PATCH(req: NextRequest) {
    try {
      const { id, ...data } = await req.json();
      if (!id) {
          return NextResponse.json({ error: 'Page ID is required for updating.' }, { status: 400 });
      }
  
      // Construct the properties object for Notion API
      const properties: any = {};
      if (data.name) properties[PROPERTY_NAMES.name] = { title: [{ text: { content: data.name } }] };
      // Send data as strings inside rich_text objects
      if (data.stock !== undefined) properties[PROPERTY_NAMES.stock] = { rich_text: [{ text: { content: String(data.stock) } }] };
      if (data.price !== undefined) properties[PROPERTY_NAMES.price] = { rich_text: [{ text: { content: String(data.price) } }] };
      if (data.status) properties[PROPERTY_NAMES.status] = { select: { name: data.status } };
  
      const response = await notion.pages.update({
        page_id: id,
        properties,
      });

      const updatedItem = pageToStockItem(response);
      return NextResponse.json(updatedItem, { status: 200 });

    } catch (error: any) {
      console.error('Notion API Error (PATCH):', error);
      if (error.code === 'validation_error') {
        const message = error.body?.message || 'Validation error.';
         if (message.includes("is not a valid select option")) {
             return NextResponse.json({ error: `"${error.body.message.split('"')[1]}" is not a valid option for the 'Status' column in Notion. Please add it as an option in your database.` }, { status: 400 });
        }
        return NextResponse.json({ error: message }, { status: 400 });
      }
      return NextResponse.json({ error: error.message || 'Failed to update item in Notion.' }, { status: 500 });
    }
}

// DELETE: Delete a page (archives it in Notion)
export async function DELETE(req: NextRequest) {
    try {
        const { id } = await req.json();
        if (!id) {
            return NextResponse.json({ error: 'Page ID is required for deleting.' }, { status: 400 });
        }

        await notion.pages.update({
            page_id: id,
            archived: true, // Archiving is Notion's way of "deleting"
        });

        return NextResponse.json({ message: 'Item deleted successfully' }, { status: 200 });

    } catch (error: any) {
        console.error('Notion API Error (DELETE):', error);
        return NextResponse.json({ error: error.body?.message || error.message || 'Failed to delete item in Notion.' }, { status: 500 });
    }
}

    