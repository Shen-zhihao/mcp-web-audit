/**
 * 给定图结构中的一个节点，获取从该节点的依赖节点出发一直走到终点，一共走出的所有链条
 * 注意：图结构中可能存在环，遇到环时，环所在的节点直接作为终点即可
 * @param {Node} node
 * @returns {Array<Set<string>>} 返回所有依赖链，每个链是一个字符串集合，每个字符串是一个节点名称
 */
export function getDepChains(node, globalNodeMap) {
  // 存储所有找到的依赖链
  const chains = [];

  // 当前DFS路径（用于检测环）
  const currentPath = [];

  /**
   * 深度优先搜索函数
   * @param {Node} currentNode - 当前处理的节点
   */
  function dfs(currentNode) {
    if (!currentNode) return;

    // 检查是否形成环（当前节点已在路径中）
    if (currentPath.includes(currentNode.name)) {
      chains.push([...currentPath]);
      return;
    }

    // 将当前节点加入路径
    currentPath.unshift(currentNode.name);

    // 如果没有依赖节点，说明到达终点
    if (!currentNode.effects || currentNode.effects.length === 0) {
      chains.push([...currentPath]);
    } else {
      // 递归处理所有依赖节点
      for (const effect of currentNode.effects) {
        dfs(globalNodeMap[effect]);
      }
    }
    // 回溯：移除当前节点
    currentPath.shift();
  }

  // 从给定节点开始DFS
  dfs(node);

  return chains;
}
