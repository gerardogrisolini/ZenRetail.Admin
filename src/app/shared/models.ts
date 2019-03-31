// Classes

export class Company {
  public companyId: number;
  public companyName: string;
  public companyWebsite: string;
  public companyAddress: string;
  public companyCity: string;
  public companyZip: string;
  public companyProvince: string;
  public companyCountry: string;
  public companyFiscalCode: string;
  public companyVatNumber: string;

  public companyDescription: Translation[];

  public companyPhone: string;
  public companyEmailInfo: string;
  public companyEmailSales: string;
  public companyEmailSupport: string;

  public companyCurrency: string;
  public companyUtc: string;
  public companyLocales: Translation[];

  public smtpHost: string;
  public smtpSsl: boolean;
  public smtpUsername: string;
  public smtpPassword: string;

  public cashOnDelivery: boolean;
  public paypalEnv: string;
  public paypalSandbox: string;
  public paypalProduction: string;
  public bankName: string;
  public backIban: string;

  public shippingStandard: boolean;
  public shippingExpress: boolean;

  public barcodeCounterPublic: number;
  public barcodeCounterPrivate: number;

  constructor() {
    this.companyId = 0;
    this.companyName = '';
    this.companyWebsite = '';
    this.companyAddress = '';
    this.companyCity = '';
    this.companyZip = '';
    this.companyProvince = '';
    this.companyCountry = '';
    this.companyFiscalCode = '';
    this.companyVatNumber = '';

    this.companyDescription = [];

    this.companyPhone = '';
    this.companyEmailInfo = '';
    this.companyEmailSales = '';
    this.companyEmailSupport = '';

    this.barcodeCounterPublic = 0;
    this.barcodeCounterPrivate = 0;

    this.companyCurrency = 'EUR'
    this.companyUtc = 'UTC'
    this.companyLocales = [];

    this.smtpHost = '';
    this.smtpSsl = false;
    this.smtpUsername = '';
    this.smtpPassword = '';

    this.cashOnDelivery = false;
    this.paypalEnv = 'sendbox';
    this.paypalSandbox = '<sendbox client id>';
    this.paypalProduction = '<production client id>';
    this.bankName = '';
    this.backIban = '';

    this.shippingStandard = false;
    this.shippingExpress = false;
  }
}

export class Login {
  constructor(
    public username: string,
    public password: string) { }
}

export class Account {
  public uniqueID: string;
  public firstname: string;
  public lastname: string;
  public email: string;
  public username: string;
  public password: string;
  public isAdmin: boolean;

  constructor() {
    this.uniqueID = '';
    this.firstname = '';
    this.lastname = '';
    this.email = '';
    this.username = '';
    this.password = '';
    this.isAdmin = false;
  }
}

export class Store {
  public storeId: number;
  public storeName: string;
  public storeAddress: string;
  public storeCity: string;
  public storeZip: string;
  public storeCountry: string;
  public updatedAt: number;

  constructor() {
    this.storeId = 0;
    this.storeName = '';
    this.storeAddress = '';
    this.storeCity = '';
    this.storeZip = '';
    this.storeCountry = '';
    this.updatedAt = 0;
  }
}

export class Brand {
  public brandId: number;
  public brandName: string;
  public translations: Translation[];
  public media: Media;
  public seo: Seo;

  constructor() {
    this.brandId = 0;
    this.brandName = '';
    this.translations = [];
    this.media = new Media('', '');
    this.seo = new Seo();
  }
}

export class Category {
  public categoryId: number;
  public categoryIsPrimary: boolean;
  public categoryName: string;
  public translations: Translation[];
  public media: Media;
  public seo: Seo;

  constructor(categoryId: number, categoryName: string) {
    this.categoryId = categoryId;
    this.categoryIsPrimary = false;
    this.categoryName = categoryName;
    this.translations = [];
    this.media = new Media('', '');
    this.seo = new Seo();
  }
}

export class Media {
  constructor(
    public name: string,
    public contentType: string) { }
}

export class Translation {
  constructor(
    public country: string,
    public value: string) { }
}

export class Seo {
  public permalink: String;
  public title: Translation[];
  public description: Translation[];

  constructor() {
    this.permalink = '';
    this.title = [];
    this.description = [];
  }
}

export class Product {
  public productId: number;
  public productCode: string;
  public productName: string;
  public productUm: string;
  public productTax: Tax;
  public price: Price;
  public discount: Discount;
  public packaging: Packaging;
  public translations: Translation[];
  public medias: Media[];
  public seo: Seo;
  public brand: Brand;
  public categories: ProductCategory[];
  public attributes: ProductAttribute[];
  public articles: Article[];
  public productIsActive: boolean;
  public productCreated: Date;
  public updatedAt: number;

  constructor() {
    this.productId = 0;
    this.productCode = '';
    this.productName = '';
    this.productUm = '';
    this.productTax = new Tax('', 0);
    this.price = new Price();
    this.discount = new Discount();
    this.packaging = new Packaging();
    this.seo = new Seo();
    this.translations = [];
    this.medias = [];
    this.categories = [];
    this.attributes = [];
    this.articles = [];
    this.productIsActive = false;
    this.productCreated = new Date();
    this.updatedAt = 0;
  }
}

export class Article {
  public articleId: number;
  public number: number;
  public barcodes: Barcode[];
  public packaging: Packaging;
  public quantity: number;
  public booked: number;
  public attributeValues: ArticleAttributeValue[];

  constructor() {
    this.articleId = 0;
    this.number = 0;
    this.barcodes = [];
    this.packaging = new Packaging();
    this.quantity = 0;
    this.booked = 0;
    this.attributeValues = [];
  }
}

export class Attribute {
  constructor(
    public attributeId: number,
    public attributeName: string,
    public translations: Translation[]
  ) {
    this.translations = [];
  }
}

export class AttributeValue {
  constructor(
    public attributeId: number,
    public attributeValueId: number,
    public attributeValueCode: string,
    public attributeValueName: string,
    public translations: Translation[]
    ) {
      this.translations = [];
    }
  }

export class TagGroup {
  constructor(
    public tagGroupId: number,
    public tagGroupName: string,
    public translations: Translation[],
    public values: TagValue[]
  ) {
    this.translations = [];
  }
}

export class TagValue {
  constructor(
    public tagGroupId: number,
    public tagValueId: number,
    public tagValueCode: string,
    public tagValueName: string,
    public translations: Translation[]
  ) {
    this.translations = [];
  }
}

export class Price {
  public selling: number;
  public purchase: number;
  constructor() {
    this.selling = 0;
    this.purchase = 0;
  }
}

export class Tax {
  constructor(
    public name: string,
    public value: number,
  ) { }
}

export class Packaging {
  public weight: number;
  public length: number;
  public width: number;
  public height: number;
  constructor() {
    this.weight = 0;
    this.length = 0;
    this.width = 0;
    this.height = 0;
  }
}

export class Publication {
  public publicationId: number;
  public productId: number;
  public publicationFeatured: boolean;
  public publicationNew: boolean;
  public publicationStartAt: Date;
  public publicationFinishAt: Date;
  public publicationUpdated: Date;

  constructor(productId: number) {
    this.publicationId = 0;
    this.productId = productId;
    this.publicationFeatured = false;
    this.publicationNew = false;
    this.publicationStartAt = null;
    this.publicationFinishAt = null;
  }}

export class Causal {
  public causalId: number;
  public causalName: string;
  public causalQuantity: number;
  public causalBooked: number;
  public causalIsPos: boolean;
  public updatedAt: number;

  constructor() {
    this.causalId = 0;
    this.causalName = '';
    this.causalQuantity = 0;
    this.causalBooked = 0;
    this.causalIsPos = false;
    this.updatedAt = 0;
  }
}

export class Registry {
  public registryId: number;
  public registryName: string;
  public registryEmail: string;
  public registryPassword: string;
  public registryPhone: string;
  public registryAddress: string;
  public registryCity: string;
  public registryZip: string;
  public registryProvince: string;
  public registryCountry: string;
  public registryFiscalCode: string;
  public registryVatNumber: string;
  public updatedAt: number;

  constructor() {
    this.registryId = 0;
    this.registryName = '';
    this.registryEmail = '';
    this.registryPassword = '';
    this.registryPhone = '';
    this.registryAddress = '';
    this.registryCity = '';
    this.registryZip = '';
    this.registryProvince = '';
    this.registryCountry = '';
    this.registryFiscalCode = '';
    this.registryVatNumber = '';
    this.updatedAt = 0;
  }
}

export class Movement {
  public movementId: number;
  public invoiceId: number;
  public movementNumber: number;
  public movementDate: Date;
  public movementDesc: string;
  public movementStore: Store;
  public movementCausal: Causal;
  public movementRegistry: Registry;
  public movementNote: string;
  public movementStatus: string;
  public movementUser: string;
  public movementDevice: string;
  public movementTags: Tag[];
  public movementPayment: string;
  public movementShipping: string;
  public movementShippingCost: number;
  public movementAmount: number;
  public updatedAt: number;

  constructor() {
    this.movementId = 0;
    this.movementNumber = 0;
    this.movementDate = new Date();
    this.movementDesc = '';
    this.movementNote = '';
    this.movementStatus = 'New';
    this.movementUser = '';
    this.movementDevice = '';
    this.movementTags = [];
    this.movementPayment = '';
    this.movementShipping = '';
    this.movementShippingCost = 0.0;
    this.movementAmount = 0.0;
    this.updatedAt = 0;
  }
}

export class MovementArticle {
  public movementArticleId: number;
  public movementId: number;
  public movementArticleBarcode: string;
  public movementArticleProduct: Product;
  public movementArticleQuantity: number;
  public movementArticleDelivered: number;
  public movementArticlePrice: number;
  public movementArticleAmount: number;

  constructor() {
    this.movementArticleId = 0;
    this.movementId = 0;
    this.movementArticleBarcode = '';
    this.movementArticleProduct = null;
    this.movementArticleQuantity = 1.0;
    this.movementArticleDelivered = 0.0;
    this.movementArticlePrice = 0.0;
    this.movementArticleAmount = 0.0;
  }
}

export class Invoice {
  public invoiceId: number;
  public invoiceNumber: number;
  public invoiceDate: Date;
  public invoiceRegistry: Registry;
  public invoicePayment: string;
  public invoiceNote: string;
  public invoiceAmount: number;
  public invoiceUpdate: Date;

  constructor() {
    this.invoiceId = 0;
    this.invoiceNumber = 0;
    this.invoiceDate = new Date();
    this.invoicePayment = '';
    this.invoiceNote = '';
    this.invoiceAmount = 0.0;
    this.invoiceUpdate = new Date();
  }
}

export class Discount {
  public percentage: number;
  public price: number;
  public startAt: Date;
  public finishAt: Date;

  constructor() {
    this.percentage = 0;
    this.price = 0;
  }

  public get isValid(): boolean {
    const date = new Date();
    return this.startAt <= date && this.finishAt >= date;
  }
}

export class Device {
  public deviceId: number;
  public deviceName: string;
  public deviceToken: string;
  public store: Store;
  public updatedAt: number;

  constructor() {
    this.deviceId = 0;
    this.deviceName = '';
    this.deviceToken = '';
    this.store = new Store();
    this.updatedAt = 0;
  }
}

export class PdfDocument {
  public address: string;
  public subject: string;
  public content: string;
  public size: string;
  public zoom: string;

  constructor() {
    this.address = '';
    this.subject = '';
    this.content = '';
    this.size = 'A4';
    this.zoom = '0.53';
  }
}

export class Period {
  public start: Date;
  public finish: Date;

  constructor() {
    this.start = new Date();
    this.finish = new Date(this.start.getFullYear(), 12, 31);
  }
}

export class MwsConfig {
  public version: string;
  public endpoint: string;
  public marketplaceId: string;
  public sellerId: string;
  public accessKey: string;
  public secretKey: string;
  public authToken: string;

  constructor() {
    this.version = '';
    this.endpoint = '';
    this.marketplaceId = '';
    this.sellerId = '';
    this.accessKey = '';
    this.secretKey = '';
    this.authToken = '';
  }
}

export class Basket {
  public basketId: number;
  public registry: Registry;
  public basketBarcode: string;
  public basketProduct: Product;
  public basketQuantity: number;
  public basketPrice: number;
  public basketUpdated: Date;

  constructor() {
    this.basketId = 0;
    this.registry = new Registry();
    this.basketBarcode = '';
    this.basketQuantity = 1.0;
    this.basketPrice = 0.0;
    this.basketUpdated = new Date();
  }
}

// Interfaces

// export interface Token {
//   error: string;
//   login: string;
//   token: string;
//   role: string;
// }

export interface Token {
  basic: string;
  bearer: string;
}

export interface ProductCategory {
  // productCategoryId: number;
  productId: number;
  category: Category;
}

export interface ProductAttribute {
  productAttributeId: number;
  productId: number;
  attribute: Attribute;
  attributeValues: ProductAttributeValue[];
}

export interface ProductAttributeValue {
  // productAttributeValueId: number;
  productAttributeId: number;
  attributeValue: AttributeValue;
}

export interface ArticleAttributeValue {
  // articleAttributeValueId: number;
  // articleId: number;
  attributeValueId: number;
  attributeValue: AttributeValue;
  medias: Media[];
}

export interface Barcode {
  barcode: string;
  tags: Tag[];
  price: Price;
  discount: Discount;
}

export interface Cost {
  value: number;
}

export interface Tag {
  groupId: number;
  groupName: string;
  valueId: number;
  valueName: string;
}

export interface ItemValue {
  value: string;
}

export interface Item {
  id: string;
  value: string;
}

export interface ArticleForm {
  header: string[];
  body: ArticleItem[][];
}

export interface ArticleItem {
  id: number;
  value: string;
  stock: number;
  booked: number;
  data: number;
}

export interface GroupItem {
  id: number;
  barcode: string;
  product: Product;
}

export interface AttributeForm {
  id: number;
  name: string;
  values: string[];
}

export interface MwsRequest {
  id: number;
  requestXml: string;
  requestId: number;
  requestParentId: number;

  requestSubmissionId: string;
  requestCreatedAt: number;
  requestSubmittedAt: number;
  requestCompletedAt: number;

  messagesProcessed: number;
  messagesSuccessful: number;
  messagesWithError: number;
  messagesWithWarning: number;
  errorDescription: string;
}

export interface Result {
  added: number;
  updated: number;
  deleted: number;
  articles: Article[];
}

export interface Whouse {
  id: number;
  sku: string;
  name: string;
  loaded: number;
  unloaded: number;
  stock: number;
}

