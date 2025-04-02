import { Injectable } from '@nestjs/common';
import { CreateMasterDto } from '../dto/create-master.dto';
import { UpdateMasterDto } from '../dto/update-master.dto';

@Injectable()
export class MastersService {
  create(createMasterDto: CreateMasterDto) {
    return 'This action adds a new master';
  }

  findAll() {
    return `This action returns all masters`;
  }

  findOne(id: number) {
    return `This action returns a #${id} master`;
  }

  update(id: number, updateMasterDto: UpdateMasterDto) {
    return `This action updates a #${id} master`;
  }

  remove(id: number) {
    return `This action removes a #${id} master`;
  }
}
