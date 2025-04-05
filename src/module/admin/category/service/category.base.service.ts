import { Injectable } from '@nestjs/common';
import { DatabaseProvider } from '@/shared/providers';

@Injectable()
export class CategoryBaseService {
  constructor(
    public readonly database: DatabaseProvider,
  ) { }

}
