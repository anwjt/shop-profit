
import { Client } from '@notionhq/client';
import { NextResponse, type NextRequest } from 'next/server';
import type { StockItem } from '@/app/notion-table/page';

// --- CONFIGURATION ---
// IMPORTANT: Replace these strings with the actual property names from your Notion database.
// These are case-sensitive.
const PROPERTY_NAMES = {
  name: 'Name',
  sku: 'SKU',
  price: 'Price',
  status: 'Status',
  platform: 'Platform', // Ensure this is a Select property in Notion
  category: 'Category',
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
    const { properties } = page;
    
    const name = properties[PROPERTY_NAMES.name]?.title[0]?.plain_text ?? '';
    const sku = properties[PROPERTY_NAMES.sku]?.rich_text[0]?.plain_text ?? '';
    const price = properties[PROPERTY_NAMES.price]?.number ?? 0;
    const status = properties[PROPERTY_NAMES.status]?.select?.name ?? 'รอขาย';
    const platform = properties[PROPERTY_NAMES.platform]?.select?.name ?? '';
    const category = properties[PROPERTY_NAMES.category]?.select?.name ?? '';

    const validStatus = ['ขายแล้ว', 'รอขาย'].includes(status) 
        ? status as StockItem['status'] 
        : 'รอขาย';

    return {
      id: page.id,
      name,
      sku,
      price,
      status: validStatus,
      platform,
      category,
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
    const { name, sku, price, status, platform, category } = await req.json();

    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        [PROPERTY_NAMES.name]: { title: [{ text: { content: name } }] },
        [PROPERTY_NAMES.sku]: { rich_text: [{ text: { content: sku } }] },
        [PROPERTY_NAMES.price]: { number: price },
        [PROPERTY_NAMES.status]: { select: { name: status } },
        [PROPERTY_NAMES.platform]: { select: { name: platform } },
        [PROPERTY_NAMES.category]: { select: { name: category } },
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
             return NextResponse.json({ error: `"${error.body.message.split('"')[1]}" is not a valid option for a 'Select' column in Notion. Please add it as an option in your database.` }, { status: 400 });
        }
        return NextResponse.json({ error: message }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Failed to create item in Notion.' }, { status: 500 });
  }
}

// PATCH: Update an existing page or a batch of pages
export async function PATCH(req: NextRequest) {
    try {
        const { batch, ...singleUpdateData } = await req.json();

        // Handle batch updates
        if (batch && Array.isArray(batch)) {
            const updatePromises = batch.map(item => {
                const { id, ...data } = item;
                 const properties: any = {};
                if (data.name) properties[PROPERTY_NAMES.name] = { title: [{ text: { content: data.name } }] };
                if (data.price !== undefined) properties[PROPERTY_NAMES.price] = { number: data.price };

                return notion.pages.update({
                    page_id: id,
                    properties,
                });
            });

            await Promise.all(updatePromises);
            return NextResponse.json({ message: `${batch.length} items updated successfully` }, { status: 200 });
        }

        // Handle single item update
        const { id, ...data } = singleUpdateData;
        if (!id) {
            return NextResponse.json({ error: 'Page ID is required for updating.' }, { status: 400 });
        }
    
        const properties: any = {};
        if (data.name) properties[PROPERTY_NAMES.name] = { title: [{ text: { content: data.name } }] };
        if (data.sku !== undefined) properties[PROPERTY_NAMES.sku] = { rich_text: [{ text: { content: data.sku } }] };
        if (data.price !== undefined) properties[PROPERTY_NAMES.price] = { number: data.price };
        if (data.status) properties[PROPERTY_NAMES.status] = { select: { name: data.status } };
        if (data.platform) properties[PROPERTY_NAMES.platform] = { select: { name: data.platform } };
        if (data.category) properties[PROPERTY_NAMES.category] = { select: { name: data.category } };
    
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
             return NextResponse.json({ error: `"${error.body.message.split('"')[1]}" is not a valid option for a 'Select' column in Notion. Please add it as an option in your database.` }, { status: 400 });
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
