
import { Client } from '@notionhq/client';
import { NextResponse, type NextRequest } from 'next/server';
import type { StockItem } from '@/app/notion-table/page';

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const databaseId = process.env.NOTION_DATABASE_ID!;

// This function converts Notion's complex page object into a simpler StockItem object.
function pageToStockItem(page: any): StockItem | null {
  try {
    // These property names MUST match your Notion database's column names.
    const name = page.properties.Name?.title?.[0]?.plain_text ?? 'Untitled';
    const stock = page.properties.Stock?.number ?? 0;
    const price = page.properties.Price?.number ?? 0;
    const status = page.properties.Status?.select?.name ?? 'Out of Stock';

    if (typeof stock !== 'number' || typeof price !== 'number') {
        return null;
    }

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
          property: 'Name',
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
        'Name': { title: [{ text: { content: name } }] },
        'Stock': { number: stock },
        'Price': { number: price },
        'Status': { select: { name: status } },
      },
    });

    const newItem = pageToStockItem(response);
    return NextResponse.json(newItem, { status: 201 });

  } catch (error: any) {
    console.error('Notion API Error (POST):', error);
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
      if (data.name) properties.Name = { title: [{ text: { content: data.name } }] };
      if (data.stock !== undefined) properties.Stock = { number: data.stock };
      if (data.price !== undefined) properties.Price = { number: data.price };
      if (data.status) properties.Status = { select: { name: data.status } };
  
      const response = await notion.pages.update({
        page_id: id,
        properties,
      });

      const updatedItem = pageToStockItem(response);
      return NextResponse.json(updatedItem, { status: 200 });

    } catch (error: any) {
      console.error('Notion API Error (PATCH):', error);
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
        return NextResponse.json({ error: error.message || 'Failed to delete item in Notion.' }, { status: 500 });
    }
}
