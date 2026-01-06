# @circuit/inject-test-utils

DI 系统测试工具库

## 用法

### 基础用法

```typescript
import { createTestUtils } from '@circuit/inject-test-utils';
import { RootScope } from '@circuit/inject';
import path from 'path';

// 创建测试工具实例
const testUtils = createTestUtils({
  scope: RootScope,
  resolveRegister: (file: string) => 
    import(path.resolve(__dirname, '../src/plugins', file)),
});

// 注册插件
testUtils.registerPlugin('services/map-coordinate/register.tsx', {
  testConfig: { /* ... */ }
});

// 获取服务
const service = await testUtils.getService(ISomeService);
```

### 工厂函数用法

```typescript
import { createScopeTestUtils } from '@circuit/inject-test-utils';
import { PainterScope } from '@circuit/contracts/painter';
import path from 'path';

// 创建特定作用域的测试工具
const painterTestUtils = createScopeTestUtils({
  scope: PainterScope,
  resolveRegister: (file: string) => 
    import(path.resolve(__dirname, '../src/plugins', file)),
});

// 使用
painterTestUtils.registerPlugin('services/map-coordinate/register.tsx');
const service = await painterTestUtils.getService(IMapCoordinateService);
```

