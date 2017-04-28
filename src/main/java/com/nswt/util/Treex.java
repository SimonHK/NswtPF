package com.nswt.util;

import com.nswt.util.data.DataRow;
import com.nswt.util.data.DataTable;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.NoSuchElementException;

/**
 * Created by hongkai on 2017/4/25.
 *  * 树形数据结构
 */
public class Treex {

    private TreeNode root = new TreeNode();

    /**
     * 获取根节点对象
     */
    public TreeNode getRoot() {
        return root;
    }

    /**
     * 根据节点数据获取节点对象
     */
    public TreeNode getNode(Object data) {
        TreeIterator ti = iterator();
        while (ti.hasNext()) {
            TreeNode tn = (TreeNode) ti.next();
            if (tn.getData().equals(data)) {
                return tn;
            }
        }
        return null;
    }

    /**
     * 遍历器，遍历整个树
     */
    public TreeIterator iterator() {
        return new TreeIterator(root);
    }

    /**
     * 以node为起始节点开始遍历
     */
    public static TreeIterator iterator(TreeNode node) {
        return new TreeIterator(node);
    }

    /**
     * 输出整个树形结构为字符串
     *
     * @see java.lang.Object#toString()
     */
    public String toString() {
        return toString(Formatter.DefaultFormatter);
    }

    /**
     * 以指定的格式输出整个树形结构
     */
    public String toString(Formatter f) {
        StringBuffer sb = new StringBuffer();
        TreeIterator ti = this.iterator();
        while (ti.hasNext()) {
            TreeNode tn = ti.nextNode();
            for (int i = 0; i < tn.getLevel() - 1; i++) {
                // sb.append("│ ");
            }
            TreeNode p = tn.getParent();
            String str = "";
            while (p != null && !p.isRoot()) {
                if (p.isLast()) {
                    str = "  " + str;
                } else {
                    str = "│ " + str;
                }
                p = p.getParent();
            }
            sb.append(str);
            if (!tn.isRoot()) {
                if (tn.isLast()) {
                    sb.append("└─");
                } else {
                    sb.append("├─");
                }
            }
            sb.append(f.format(tn.getData()));
            sb.append("\n");
        }
        return sb.toString();
    }

    /**
     * 获取所有节点组成的数组
     */
    public TreeNode[] toArray() {
        TreeIterator ti = new TreeIterator(root);
        ArrayList arr = new ArrayList();
        while (ti.hasNext()) {
            arr.add(ti.next());
        }
        TreeNode[] tns = new TreeNode[arr.size()];
        for (int i = 0; i < arr.size(); i++) {
            tns[i] = (TreeNode) arr.get(i);
        }
        return tns;
    }

    /**
     * 以某一节点为父节点遍历该节点用其所有子节点
     */
    public static class TreeIterator implements Iterator {
        private TreeNode last;

        private TreeNode next;

        private TreeNode start;

        /**
         * 以node为父节点，构造一个遍历器
         */
        TreeIterator(TreeNode node) {
            start = next = node;
        }

        /**
         * 是否还有下一个节点
         *
         * @see java.util.Iterator#hasNext()
         */
        public boolean hasNext() {
            if (next == null) {
                return false;
            }
            if (next != start && next.getLevel() == start.getLevel()) {
                return false;
            }
            return true;
        }

        /**
         * 获取下一个节点
         *
         * @see java.util.Iterator#next()
         */
        public Object next() {
            if (next == null) {
                throw new NoSuchElementException();
            }
            last = next;
            if (next.hasChild()) {
                next = next.getChildren().get(0);
            } else {
                while (next.getNextSibling() == null) {
                    if (next.parent.isRoot()) {
                        next = null;
                        return last;
                    } else {
                        next = next.parent;
                    }
                }
                next = next.getNextSibling();
            }
            return last;
        }

        public TreeNode nextNode() {
            return (TreeNode) next();
        }

        public TreeNode currentNode() {
            return next;
        }

        /**
         * 删除当前节点
         *
         * @see java.util.Iterator#remove()
         */
        public void remove() {
            if (last == null) {
                throw new IllegalStateException();
            }
            last.parent.getChildren().remove(last);
            last = null;
        }
    }

    /**
     * 树形结构中的一个节点
     *
     * @author NSWT
     * @date 2009-11-16
     * @email nswt@nswt.com.cn
     */
    public static class TreeNode {
        private int level;

        private Object data;

        private TreeNodeList children = new TreeNodeList(this);

        private TreeNode parent;

        private int pos;// 在上级元素中的位置

        /**
         * 构造函数
         */
        public TreeNode() {
        }

        /**
         * 为本节点添加一个子节点，并为子节点指定节点数据
         */
        public TreeNode addChild(Object data) {
            TreeNode tn = new TreeNode();
            tn.level = level + 1;
            tn.data = data;
            tn.parent = this;
            tn.pos = children.size();
            children.arr.add(tn);
            return tn;
        }

        /**
         * 根据节点数据删除一个子节点
         */
        public void removeChild(Object data) {
            for (int i = 0; i < children.size(); i++) {
                if (children.get(i).getData().equals(data)) {
                    children.remove(i);
                    break;
                }
            }
        }

        /**
         * 上一个节点，没有上一个节点则返回null
         */
        public TreeNode getPreviousSibling() {
            if (pos == 0) {
                return null;
            }
            return parent.getChildren().get(pos - 1);
        }

        /**
         * 下一个节点,没有下一个节点则返回null
         */
        public TreeNode getNextSibling() {
            if (parent == null || pos == parent.getChildren().size() - 1) {
                return null;
            }
            return parent.getChildren().get(pos + 1);
        }

        /**
         * 节点在树形结构中的级别，根节点为0
         */
        public int getLevel() {
            return level;
        }

        /**
         * 是否是根节点
         */
        public boolean isRoot() {
            return parent == null;
        }

        /**
         * 是否是最后一个节点
         */
        public boolean isLast() {
            if (parent != null && pos != parent.getChildren().size() - 1) {
                return false;
            }
            return true;
        }

        /**
         * 是否含有子节点
         */
        public boolean hasChild() {
            return children.size() != 0;
        }

        /**
         * 获取上一级节点对象
         */
        public TreeNode getParent() {
            return parent;
        }

        /**
         * 当前节点在父节点的所有子节点中是第几个
         */
        public int getPosition() {
            return pos;
        }

        /**
         * 获取所有子节点列表
         */
        public TreeNodeList getChildren() {
            return children;
        }

        /**
         * 获取节点数据
         */
        public Object getData() {
            return data;
        }

        /**
         * 设置节点数据
         */
        public void setData(Object data) {
            this.data = data;
        }
    }

    /**
     * 节点列表类
     *
     * @author NSWT
     * @date 2009-11-16
     * @email nswt@nswt.com.cn
     */
    public static class TreeNodeList {
        protected ArrayList arr = new ArrayList();

        private TreeNode parent;

        /**
         * 构造指定父节点的子节点列表对象
         */
        public TreeNodeList(TreeNode parent) {
            this.parent = parent;
        }

        /**
         * 添加一个子节点
         */
        public void add(TreeNode node) {
            parent.addChild(node);
        }

        /**
         * 删除一个子节点
         */
        public TreeNode remove(TreeNode node) {
            int pos = node.getPosition();
            for (int i = pos + 1; i < arr.size(); i++) {
                TreeNode tn = (TreeNode) arr.get(i);
                tn.pos--;
            }
            arr.remove(node);
            return node;
        }

        /**
         * 删除第i个子节点
         */
        public TreeNode remove(int i) {
            return remove((TreeNode) arr.get(i));
        }

        /**
         * 获取第i个子节点
         */
        public TreeNode get(int i) {
            return (TreeNode) arr.get(i);
        }

        /**
         * 获取最后一个子节点
         */
        public TreeNode last() {
            return (TreeNode) arr.get(arr.size() - 1);
        }

        /**
         * 子节点总数
         */
        public int size() {
            return arr.size();
        }
    }

    /**
     * 根据DataTable构造一个树形结构，DataTable必须有ID和ParentID两个字段，两个字段构成父子关系
     */
    public static Treex dataTableToTree(DataTable dt) {
        return dataTableToTree(dt, "ID", "ParentID");
    }

    /**
     * 根据DataTable构造一个树形结构，DataTable中指定的两个字段必须构成父子关系
     */
    public static Treex dataTableToTree(DataTable dt, String identifierColumnName, String parentIdentifierColumnName) {
        Treex tree = new Treex();
        Mapx map = dt.toMapx(identifierColumnName, parentIdentifierColumnName);
        Mapx map2 = dt.toMapx(parentIdentifierColumnName, identifierColumnName);
        for (int i = 0; i < dt.getRowCount(); i++) {
            String ID = dt.getString(i, identifierColumnName);
            String parentID = map.getString(ID);
            if (StringUtil.isEmpty(parentID) || !map.containsKey(parentID)) {
                DataRow dr = dt.getDataRow(i);
                TreeNode tn = tree.root.addChild(dr);
                dealNode(dt, tn, map2, identifierColumnName, parentIdentifierColumnName);
            }
        }
        return tree;
    }

    /**
     * 递归处理DataTable中的父子关系
     */
    private static void dealNode(DataTable dt, TreeNode tn, Mapx map, String identifierColumnName,
                                 String parentIdentifierColumnName) {
        DataRow dr = (DataRow) tn.getData();
        String ID = dr.getString(identifierColumnName);
        for (int i = 0; i < dt.getRowCount(); i++) {
            String ChildID = dt.getString(i, identifierColumnName);
            String parentID = dt.getString(i, parentIdentifierColumnName);
            if (ChildID.equals("29") && ID.equals("28")) {
                System.out.println(1);
            }
            if (parentID != null && parentID.equals(ID)) {
                TreeNode childNode = tn.addChild(dt.getDataRow(i));
                if (map.get(ChildID) != null) {// 不是叶子节点
                    dealNode(dt, childNode, map, identifierColumnName, parentIdentifierColumnName);
                }
            }
        }
    }

}
