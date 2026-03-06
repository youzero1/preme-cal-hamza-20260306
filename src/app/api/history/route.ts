import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';
import { CalculationHistory } from '@/entities/CalculationHistory';

export async function GET() {
  try {
    const dataSource = await getDatabase();
    const repo = dataSource.getRepository(CalculationHistory);
    const history = await repo.find({
      order: { createdAt: 'DESC' },
      take: 50,
    });
    return NextResponse.json({ success: true, data: history });
  } catch (error) {
    console.error('Error fetching history:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { expression, result } = body;

    if (!expression || result === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing expression or result' },
        { status: 400 }
      );
    }

    const dataSource = await getDatabase();
    const repo = dataSource.getRepository(CalculationHistory);

    const entry = repo.create({
      expression: String(expression),
      result: String(result),
    });

    const saved = await repo.save(entry);
    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error) {
    console.error('Error saving history:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save history' },
      { status: 500 }
    );
  }
}
