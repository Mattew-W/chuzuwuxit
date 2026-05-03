declare module 'dom-to-image-more' {
  interface Options {
    quality?: number
    width?: number
    height?: number
    style?: Record<string, string>
  }
  function toBlob(node: HTMLElement, options?: Options): Promise<Blob>
  function toPng(node: HTMLElement, options?: Options): Promise<string>
  export default { toBlob, toPng }
}
