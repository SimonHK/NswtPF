package com.nswt.service.bpm.bpmmodel.impl;

import com.nswt.dao.DaoSupport;
import com.nswt.entity.Page;
import com.nswt.service.bpm.bpmmodel.BpmModelManager;
import com.nswt.util.PageData;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

/** 
 * 说明： 流程模型建模
 * 创建人：hongkai
 * 创建时间：2017-02-02
 * 邮箱地址：18611949252@163.com
 * @version
 */
@Service("bpmmodelService")
public class BpmModelService implements BpmModelManager{

	@Resource(name = "daoSupport")
	private DaoSupport dao;

	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd)throws Exception {



		/*dao.save("BpmModelMapper.save", pd);*/
	}
	
	/**删除
	 * @param pd
	 * @throws Exception
	 */
	public void delete(PageData pd)throws Exception {
		/*dao.delete("BpmModelMapper.delete", pd);*/
	}
	
	/**修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd)throws Exception {
		/*dao.update("BpmModelMapper.edit", pd);*/
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public List<PageData> list(Page page)throws Exception {
		return (List<PageData>)dao.findForList("BpmModelMapper.datalistPage", page);
	}
	
	/**列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public List<PageData> listAll(PageData pd)throws Exception {
		return (List<PageData>)dao.findForList("BpmModelMapper.listAll", pd);
	}
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception {
		return (PageData)dao.findForObject("BpmModelMapper.findById", pd);
	}
	
	/**批量删除
	 * @param ArrayDATA_IDS
	 * @throws Exception
	 */
	public void deleteAll(String[] ArrayDATA_IDS)throws Exception {
		/*dao.delete("BpmModelMapper.deleteAll", ArrayDATA_IDS);*/
	}
	
}

