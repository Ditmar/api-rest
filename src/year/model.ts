import { BaseCollection } from '../data-collection/base-collection/baseCollection';

export interface Year {
  year: number;
}

class YearCollection extends BaseCollection {
  get(): Promise<Year[]> {
    return this.getAllYears();
  }

  async getAllYears(): Promise<Year[]> {
    return [
      { year: 2020 },
      { year: 2021 },
      { year: 2022 },
      { year: 2023 }
    ];
  }

  async createYear(year: Year): Promise<Year> {
    if (!year || typeof year.year !== 'number' || year.year.toString().length !== 4) {
      throw new Error('Invalid year format');
    }
    
    return year;
  }

  async deleteYear(year: number): Promise<boolean> {
    const hasArticles = await this.checkIfYearHasArticles(year);
    
    if (hasArticles) {
      throw new Error(`Cannot delete year ${year} because it has associated articles`);
    }
    
    return true;
  }

  private async checkIfYearHasArticles(year: number): Promise<boolean> {
    const yearsWithArticles = [2021, 2023];
    return yearsWithArticles.includes(year);
  }
}

export { YearCollection };