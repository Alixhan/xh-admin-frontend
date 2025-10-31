// 树形节点接口，子节点类型与自身一致
interface TreeNode {
  children?: this[]
}

/**
 * 在树结构中通过ID查找节点（非递归实现）
 * @param tree 树结构数组
 * @param targetId 要查找的节点ID
 * @param idProp 节点中存储ID的属性名，默认为'id'
 * @returns 找到的节点或null
 */
export function findTreeNodeById<T extends TreeNode>(
  tree: T[],
  targetId: string | number,
  idProp: keyof T
) {
  // 创建一个栈，用于存储待处理的节点
  const stack: T[] = [...tree]
  
  // 当栈不为空时继续处理
  while (stack.length) {
    // 从栈顶取出一个节点
    const node = stack.pop()

    if (node) {
      // 检查当前节点是否为目标节点
      if (node[idProp] === targetId) {
        return node
      }

      const children = (node as any).children as T[]
      if (Array.isArray(children) && children.length > 0) {
        // 将子节点压入栈中（顺序相反以保持原有顺序）
        stack.push(...children.reverse())
      }
    }
  }
}


/**
 * 根据参考树对目标树进行排序，并覆盖匹配节点的属性
 * @param tree 需要排序和更新的树形数据
 * @param referenceTree 用于排序参考和属性来源的树形数据
 * @param idProperty 节点ID属性的名称（必须是节点类型的有效键）
 * @returns 处理后的树形数据（与输入树类型一致）
 */
export function sortTreeByReference<T extends TreeNode>(tree: T[], referenceTree: T[], idProperty: keyof T): T[] {
  if (!tree || !referenceTree) {
    return [...(tree || [])]
  }

  // 深拷贝原始树，避免修改源数据
  const targetTree: T[] = JSON.parse(JSON.stringify(tree))
  const refTree: T[] = JSON.parse(JSON.stringify(referenceTree))

  // 栈存储待处理的节点数组及对应参考节点数组
  const stack: [T[], T[]][] = [[targetTree, refTree]]

  // 迭代处理所有节点
  while (stack.length > 0) {
    const [currentNodes, referenceNodes] = stack.pop()!

    if (!currentNodes || !referenceNodes || currentNodes.length === 0) {
      continue
    }

    // 建立参考节点ID与节点的映射
    const referenceIdMap = new Map<any, T>()
    referenceNodes.forEach((node) => {
      const nodeId = node[idProperty]
      if (nodeId !== undefined && nodeId !== null) {
        referenceIdMap.set(nodeId, node)
      }
    })

    // 分离匹配与未匹配节点，并覆盖匹配节点的属性
    const matchedNodes: T[] = []
    const unmatchedNodes: T[] = []

    currentNodes.forEach((node) => {
      const nodeId = node[idProperty]
      const refNode = referenceIdMap.get(nodeId)

      if (nodeId !== undefined && nodeId !== null && refNode) {
        // 保存子节点引用
        const children = node.children
        // 覆盖属性（除了children）
        Object.assign(node, refNode)
        // 恢复子节点引用
        node.children = children
        matchedNodes.push(node)
      } else {
        unmatchedNodes.push(node)
      }
    })

    // 按参考树顺序排序匹配节点
    matchedNodes.sort((a, b) => {
      const indexA = referenceNodes.findIndex((rn) => rn[idProperty] === a[idProperty])
      const indexB = referenceNodes.findIndex((rn) => rn[idProperty] === b[idProperty])
      return indexA - indexB
    })

    // 合并排序结果（匹配节点在前，未匹配节点保持原顺序）
    const sortedNodes = [...matchedNodes, ...unmatchedNodes]

    // 更新当前节点数组
    currentNodes.length = 0
    currentNodes.push(...sortedNodes)

    // 子节点入栈（逆序入栈以保持处理顺序）
    for (let i = sortedNodes.length - 1; i >= 0; i--) {
      const node = sortedNodes[i]
      const nodeId = node[idProperty]
      const refNode = referenceIdMap.get(nodeId)

      if (node.children && node.children.length > 0) {
        stack.push([node.children as T[], (refNode?.children as T[]) || []])
      }
    }
  }

  return targetTree
}

// 测试
// function test() {
//   const tree1 = [
//     { id: 1 },
//     { id: 2 },
//     { id: 3, label: '流口水的反馈' },
//     { id: 4 },
//     { id: 5, label: '流口水的反馈' },
//     { id: 6 },
//     {
//       id: 7,
//       children: [{ id: 8 }, { id: 9 }, { id: 10 }, { id: 11 }]
//     }
//   ]
//
//   const tree2 = [
//     { id: 3, label: '哈哈哈' },
//     { id: 5 },
//     {
//       id: 7,
//       children: [{ id: 10 }]
//     }
//   ]
//
//   console.info(JSON.stringify(sortTreeByReference(tree1, tree2, 'id')))
// }