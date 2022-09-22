import voucherRepository from '../../src/repositories/voucherRepository'
import voucherService from '../../src/services/voucherService'

describe('testa a função createVoucher', () => {
  it('testa se a função não lança nenhum erro caso seja passado dados válidos', async () => {
    const code = 'Voucher40'
    const discount = 40
    const voucher = null
    const createVoucher = {
      id: 1,
      code,
      discount,
      used: false
    }

    jest
      .spyOn(voucherRepository, 'getVoucherByCode')
      .mockResolvedValueOnce(voucher)

    jest
      .spyOn(voucherRepository, 'createVoucher')
      .mockResolvedValueOnce(createVoucher)

    let errorMessage: string | undefined
    try {
      await voucherService.createVoucher(code, discount)
    } catch (error) {
      errorMessage = error.message
    }

    expect(errorMessage).toBeUndefined()
  })

  it('testa conflito entre voucher', async () => {
    const code = 'Voucher40'
    const discount = 40

    const voucher = {
      id: 1,
      code,
      discount,
      used: false
    }

    jest
      .spyOn(voucherRepository, 'getVoucherByCode')
      .mockResolvedValueOnce(voucher)

    let result: string

    try {
      await voucherService.createVoucher(code, discount)
    } catch (error) {
      result = error.message
    }

    expect(result).toEqual('Voucher already exist.')
  })
})

describe('testa a função applyVoucher', () => {
  it('testa se o voucher esta sendo usado corretamente', async () => {
    const code = 'Voucher40'
    const amount = 1000
    const discount = 40
    const finalAmount = amount * (1 - discount / 100)

    const voucher = {
      id: 1,
      code,
      discount,
      used: false
    }

    const usedVoucher = {
      id: 1,
      code,
      discount,
      used: true
    }

    const expectReturn = {
      amount,
      discount: voucher.discount,
      finalAmount,
      applied: true
    }

    jest
      .spyOn(voucherRepository, 'getVoucherByCode')
      .mockResolvedValueOnce(voucher)

    jest
      .spyOn(voucherRepository, 'useVoucher')
      .mockResolvedValueOnce(usedVoucher)

    const result = await voucherService.applyVoucher(code, amount)

    expect(result).toEqual(expectReturn)
  })

  it('testa um voucher que não existe', async () => {
    const code = 'Voucher40'
    const amount = 1000
    const voucher = null

    jest
      .spyOn(voucherRepository, 'getVoucherByCode')
      .mockResolvedValueOnce(voucher)

    let result: string

    try {
      await voucherService.applyVoucher(code, amount)
    } catch (error) {
      result = error.message
    }

    expect(result).toEqual('Voucher does not exist.')
  })

  it('testa um voucher usado', async () => {
    const code = 'Voucher40'
    const amount = 1000
    const discount = 40
    const used = true

    const voucher = {
      id: 1,
      code,
      discount,
      used
    }

    const expectReturn = {
      amount,
      discount: voucher.discount,
      finalAmount: amount,
      applied: false
    }

    jest
      .spyOn(voucherRepository, 'getVoucherByCode')
      .mockResolvedValueOnce(voucher)

    const result = await voucherService.applyVoucher(code, amount)

    expect(result).toEqual(expectReturn)
  })
})
