export default {
  m: {
    comment: 'Comment',
    table: {
      index: 'Index',
      unit: '',
      total: 'Total',
      selected: 'Selected',
      colSort: 'Col Sort',
      operation: 'Operations',
      allCol: 'All',
      export: 'Export',
      complexFilter: 'Complex Filter',
      fileName: 'Table Data',
      exportConfirm: 'Confirm export?',
      exportCurrent: 'Export Current Page',
      exportAll: 'Export All',
      exportFail: 'Export failed',
      exportNoData: 'No data can be exported！',
      and: 'and',
      or: 'or',
      ct: 'contain',
      nct: 'not contain',
      eq: 'equal',
      ne: 'not equal',
      gt: 'greater than',
      ge: 'greater equal',
      lt: 'less than',
      le: 'less equal',
      in: 'contain in',
      bt: 'between'
    },
    topFilter: {
      query: 'Query',
      search: 'Search',
      reset: 'Reset',
      expand: 'Expand',
      collapse: 'Collapse'
    },
    form: {
      toInput: 'Please input {label}',
      toSelect: 'Please select {label}',
      refresh: 'Refresh',
      enlarge: 'Enlarge',
      reduce: 'Reduce',
      clockwise: 'Clockwise',
      anticlockwise: 'Anticlockwise',
      cutConfirmation: 'Confirm',
      iconSearch: 'Type to search',
      shortcuts1: 'Within the last week',
      shortcuts2: 'Within the last month',
      shortcuts3: 'Last three months',
      shortcuts4: 'Last six months',
      shortcuts5: 'This month',
      shortcuts6: 'This year',
      shortcuts7: 'Last month',
      shortcuts8: 'Last year',
      lib: 'File Lib',
      selectFile: 'Select File',
      selectFromLib: 'Select from library',
      imageCropper: 'Image Cropper',
      beEmpty: '{label} can not be empty',
      wrongFormat: '{label} format error',
      maxlength: '{label} cannot exceed {maxlength} characters',
      minlength: '{label} cannot be less than {minlength} characters',
      valRestriction: '{label} can only be enums {enums}',
      formatTip: '{label} format is {format}'
    },
    excelImport: {
      downloadTemplate: 'Download Template',
      confirmImport: 'Confirm Import',
      templateFileName: 'Excel import template.xlsx',
      step1Do: 'Importing excel',
      step1Error: 'Failed to import excel file',
      step2Do: 'Parsing excel',
      step2Error: 'Failure to parse excel',
      step2Success: 'Parsing excel successfully',
      step3Do: 'Verifying data',
      step3Error: 'Validation data error',
      step3Success: 'Verify data successfully',
      step4Do: 'Importing data',
      step4Error: 'Import failed (server verification failed)',
      step4Success: 'Data import succeeded',
      step5Do: 'Clearing',
      step5Success: 'Clear successfully',
      num: 'Data line number',
      excelNum: 'Excel line number',
      templateMismatch: 'Template mismatch',
      noData: 'No data to import!'
    }
  },
  common: {
    tip: 'Tip',
    expand: 'Expand',
    collapse: 'Collapse',
    add: 'Add',
    edit: 'Edit',
    detail: 'Detail',
    del: 'Delete',
    all: 'All',
    copy: 'Copy',
    paste: 'Paste',
    cache: 'Cache',
    enabled: 'Enabled',
    isCache: 'Cached',
    order: 'Order',
    isEnabled: 'Enabled',
    createTime: 'Create Time',
    updateTime: 'Update Time',
    more: 'More',
    save: 'Save',
    cancel: 'Cancel',
    confirmDelete: 'Are you sure you want to delete it? It cannot be recovered!',
    saveSuccess: 'Save success.',
    restoreDefault: 'Restore Default',
    select: 'Select',
    clear: 'Clear',
    imports: 'Imports',
    switch: 'Switch',
    importSuccess: 'Import success',
    importsFailed: 'Import failed',
    errorMsg: 'Error message',
    confirm: 'Confirm',
    confirmMsg: 'Do you want to continue this operation?',
    loadingText: 'Operating',
    successMsg: 'Operate successfully',
    optFailed: 'Operation failure',
    noMenus: 'The current role is not assigned menu, please login again!'
  },
  layout: {
    switchLocaleError: 'Failed to switch language',
    activeRole: 'Current role',
    personalCenter: 'Personal Center',
    switchRole: 'Switch Roles',
    logout: 'Logout',
    logoutSuccess: 'Logout Success'
  },
  setting: {
    layout: 'Layout Setting',
    theme: 'Theme',
    showLogo: 'Show Logo',
    menuUnique: 'Menu Unique',
    showNavTabIcon: 'Tab Icon',
    menuWidth: 'Menu Width',
    tabStyle: {
      label: 'Tab Style',
      square: 'Square',
      mellow: 'Mellow'
    },
    size: {
      label: 'Size',
      small: 'Small',
      default: 'Default',
      large: 'Large'
    }
  },
  login: {
    account: 'Please input account',
    password: 'Please input password',
    captcha: 'Please input captcha',
    login: 'Login'
  },
  home: {
    pie: 'Pie',
    line: 'Line',
    bar: 'Bar',
    pressure: 'Pressure',
    grossSales: 'Gross Sales',
    customers: 'Total Customers',
    grossProfit: 'Gross Profit',
    orders: 'Total Orders'
  },
  system: {
    dict: {
      label: 'Data Dictionary',
      add: '@:system.dict.label @:common.add',
      edit: '@:system.dict.label @:common.edit',
      detail: '@:system.dict.label @:common.detail',
      all: 'All',
      parent: 'Parent id',
      parentName: 'Parent Dict',
      dictTypeId: 'Dict Type Id',
      dictTypeName: 'Dict Type Name',
      value: 'Dict Value',
      labelName: 'Dict Name',
      orderComment: 'The order of the data dictionary, small first, large second.',
      selectDictType: 'Select @.lower:system.dict.dictTypeName',
      selectParent: 'Select @.lower:system.dict.parentName'
    },
    file: {
      label: 'File',
      edit: '@:system.file.label @:common.edit',
      detail: '@:system.file.label @:common.detail',
      object: 'Object Key',
      name: 'File Name',
      contentType: 'Content Type',
      suffix: 'Extension',
      size: 'Size',
      preview: 'Preview',
      imgWidth: 'Image Width',
      imgHeight: 'Image Height',
      status: 'Status',
      imgRatio: 'Aspect Ratio',
      sha1: 'Sha1',
      sha1Comment: 'The sha1 of the same file is the same, and the same sha1 will not upload files twice.',
      download: 'Download',
      createTime: 'Upload Time'
    },
    menu: {
      label: 'Menu',
      add: '@:system.menu.label @:common.add',
      edit: '@:system.menu.label @:common.edit',
      detail: '@:system.menu.label @:common.detail',
      copy: '@:system.menu.label @:common.copy',
      title: 'Menu Title',
      platform: 'Platform',
      type: 'Menu Type',
      icon: 'Menu Icon',
      parent: 'Parent Menu',
      parentPlaceholder: 'Please select parent menu',
      handleType: 'Process Type',
      orderComment: 'The order of the menu is small first and large second.',
      path: 'Route Path',
      component: 'Component Path',
      outerUrl: 'Link Address'
    },
    org: {
      label: 'Organization',
      add: '@:system.org.label @:common.add',
      edit: '@:system.org.label @:common.edit',
      detail: '@:system.org.label @:common.detail',
      code: 'Organization Code',
      name: 'Organization Name',
      parentId: 'Parent Org Id',
      parentName: 'Parent Org Name',
      all: 'All',
      select: 'Select Org',
      selectParent: 'Select parent org'
    },
    role: {
      label: 'Role',
      add: '@:system.role.labe l@:common.add',
      edit: '@:system.role.label @:common.edit',
      detail: '@:system.role.label @:common.detail',
      name: 'Role Name',
      permission: 'permission',
      parentId: 'Parent Role Id',
      parentName: 'Parent Role Name',
      selectParent: 'Select Parent Role',
      select: 'Select role'
    },
    user: {
      label: 'User',
      add: '@:system.user.label@:common.add',
      edit: '@:system.user.label@:common.edit',
      detail: '@:system.user.label@:common.detail',
      job: 'User Job',
      role: 'User Role',
      inGroup: 'User Group',
      code: 'User Account',
      name: 'User Name',
      avatar: 'Avatar',
      telephone: 'Telephone',
      allowRepeat: 'Allow Repeat',
      autoRenewal: 'Auto Renewal',
      telephoneNote: 'An 11-digit cell phone number',
      password: 'Password',
      newPassword: 'New Password',
      newPasswordH: 'If you need to change your password, please type in the new password.',
      repeatPassword: 'Repeat new password',
      passwordMismatches: 'Two different password entries!',
      status: 'User Status',
      lockMsg: 'Cause Of Locking',
      jobMaintain: 'Post Maintenance',
      userCodeRule: 'Login accounts can only be upper - and lowercase letters and numbers!',
      select: 'Select User',
      jobSuccess: 'User post saved successfully.',
      imports: '@:system.user.label @:common.imports',
      group: {
        label: 'User Group',
        add: '@:system.user.group.label @:common.add',
        edit: '@:system.user.group.label @:common.edit',
        detail: '@:system.user.group.label @:common.detail',
        name: 'User Group Name',
        job: 'User Group Job',
        user: 'User Group Member'
      }
    }
  },
  monitor: {
    online: {
      userCode: 'User Code',
      userName: 'User Name',
      loginTime: 'Login Time',
      loginAddress: 'Address',
      loginBrowser: 'Browser',
      browserVersion: 'Browser Version',
      loginOs: 'Login OS',
      isMobile: 'Is Mobile',
      orgName: 'Org Name',
      roleName: 'Role Name',
      localeLabel: 'Locale Label',
      forceLogout: 'Force Logout',
      confirmLogout: 'Reconfirm kicking this user offline? The user will need to log back in after being kicked off！'
    }
  }
}