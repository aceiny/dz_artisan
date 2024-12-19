import { Test, TestingModule } from '@nestjs/testing';
import { CertificationController } from './certification.controller';
import { CertificationService } from './certification.service';

describe('CertificationController', () => {
  let controller: CertificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CertificationController],
      providers: [CertificationService],
    }).compile();

    controller = module.get<CertificationController>(CertificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
