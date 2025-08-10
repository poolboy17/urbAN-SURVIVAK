
import { getGlobalData } from '../../utils/global-data'

describe('global-data', () => {
  it('returns global data object', () => {
    const globalData = getGlobalData()
    expect(typeof globalData).toBe('object')
    expect(globalData).toHaveProperty('name')
    expect(globalData).toHaveProperty('blogTitle')
    expect(globalData).toHaveProperty('footerText')
  })

  it('has correct data structure', () => {
    const globalData = getGlobalData()
    expect(typeof globalData.name).toBe('string')
    expect(typeof globalData.blogTitle).toBe('string')
    expect(typeof globalData.footerText).toBe('string')
  })

  it('returns consistent data', () => {
    const data1 = getGlobalData()
    const data2 = getGlobalData()
    expect(data1).toEqual(data2)
  })
})
