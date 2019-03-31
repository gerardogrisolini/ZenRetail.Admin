import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
// import { RegisterComponent } from './login/register.component';
import { PaymentComponent } from './setting/payment.component';
import { ShippingComponent } from './setting/shipping.component';
import { LocalizationComponent } from './setting/localization.component';
import { SmtpComponent } from './setting/smtp.component';
import { CompanyComponent } from './setting/company.component';

import { AccountComponent } from './account/account.component';
import { MyInfoComponent } from './account/myinfo.component';
import { AttributesComponent } from './attribute/attributes.component';
import { TagComponent } from './tag/tag.component';
import { BrandComponent } from './brand/brand.component';
import { CategoryComponent } from './category/category.component';
import { CausalComponent } from './causal/causal.component';
import { RegistryComponent } from './registry/registry.component';
import { StoreComponent } from './store/store.component';
import { ProductsComponent } from './product/products.component';
import { ProductComponent } from './product/product.component';
import { ImportComponent } from './product/import.component';
import { StockComponent } from './product/stock.component';
import { MovementsComponent } from './movement/movements.component';
import { MovementComponent } from './movement/movement.component';
import { DocumentComponent } from './movement/document.component';
import { BarcodeComponent } from './movement/barcode.component';
import { InvoicesComponent } from './invoice/invoices.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { InvoiceDocumentComponent } from './invoice/invoicedocument.component';
import { DeviceComponent } from './device/device.component';
import { ReportReceiptsComponent } from './report/receipts.component';
import { ReportSalesComponent } from './report/sales.component';
import { StatisticsComponent } from './report/statistics.component';
import { WhouseComponent } from './report/whouse.component';
import { AmazonComponent } from './setting/amazon.component';
import { RequestComponent } from './amazon/request.component';
import { CartComponent } from './cart/cart.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent, pathMatch: 'full' },
    { path: 'login', component: LoginComponent, pathMatch: 'full' },
    // { path: 'login/register', component: RegisterComponent, pathMatch: 'full' },
    { path: 'company', component: CompanyComponent, pathMatch: 'full' },
    { path: 'payment', component: PaymentComponent, pathMatch: 'full' },
    { path: 'shipping', component: ShippingComponent, pathMatch: 'full' },
    { path: 'smtp', component: SmtpComponent, pathMatch: 'full' },
    { path: 'localization', component: LocalizationComponent, pathMatch: 'full' },
    { path: 'account', component: AccountComponent, pathMatch: 'full' },
    { path: 'myinfo', component: MyInfoComponent, pathMatch: 'full' },
    { path: 'store', component: StoreComponent, pathMatch: 'full' },
    { path: 'brand', component: BrandComponent, pathMatch: 'full' },
    { path: 'category', component: CategoryComponent, pathMatch: 'full' },
    { path: 'attribute', component: AttributesComponent, pathMatch: 'full' },
    { path: 'tag', component: TagComponent, pathMatch: 'full' },
    { path: 'causal', component: CausalComponent, pathMatch: 'full' },
    { path: 'registry', component: RegistryComponent, pathMatch: 'full' },
    { path: 'product', component: ProductsComponent, pathMatch: 'full' },
    { path: 'product/:id', component: ProductComponent, pathMatch: 'full' },
    { path: 'product/:id/stock', component: StockComponent, pathMatch: 'full' },
    { path: 'movement', component: MovementsComponent, pathMatch: 'full' },
    { path: 'movement/:id', component: MovementComponent, pathMatch: 'full' },
    { path: 'movement/document/:id', component: DocumentComponent, pathMatch: 'full' },
    { path: 'movement/barcode/:id', component: BarcodeComponent, pathMatch: 'full' },
    { path: 'invoice', component: InvoicesComponent, pathMatch: 'full' },
    { path: 'invoice/:id', component: InvoiceComponent, pathMatch: 'full' },
    { path: 'invoice/document/:id', component: InvoiceDocumentComponent, pathMatch: 'full' },
    { path: 'device', component: DeviceComponent, pathMatch: 'full' },
    { path: 'report/receipts', component: ReportReceiptsComponent, pathMatch: 'full' },
    { path: 'report/sales', component: ReportSalesComponent, pathMatch: 'full' },
    { path: 'report/statistics', component: StatisticsComponent, pathMatch: 'full' },
    { path: 'report/whouse', component: WhouseComponent, pathMatch: 'full' },
    { path: 'import', component: ImportComponent, pathMatch: 'full' },
    { path: 'amazon', component: AmazonComponent, pathMatch: 'full' },
    { path: 'request', component: RequestComponent, pathMatch: 'full' },
    { path: 'cart', component: CartComponent, pathMatch: 'full' }
];

export const AppRoutes = RouterModule.forRoot(routes);
