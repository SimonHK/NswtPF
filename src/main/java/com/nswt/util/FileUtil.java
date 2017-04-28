package com.nswt.util;

import com.nswt.util.log.LogUtil;
import org.apache.commons.lang.ArrayUtils;

import java.io.*;
import java.net.URL;
import java.nio.ByteBuffer;
import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.channels.FileChannel.MapMode;
import java.util.Date;
import java.util.regex.Pattern;

/**	文件处理
*  创建人：HongKai
 * 创建时间：2014年12月23日
 */
public class FileUtil {
	
	/**获取文件大小 返回 KB 保留3位小数  没有文件时返回0
	 * @param filepath 文件完整路径，包括文件名
	 * @return
	 */
	public static Double getFilesize(String filepath){
		File backupath = new File(filepath);
		return Double.valueOf(backupath.length())/1000.000;
	}
	
	/**
	 * 创建目录
	 * @param destDirName //目标目录名
	 * @return 
	 */
	public static Boolean createDir(String destDirName) {
		File dir = new File(destDirName);
		if(!dir.getParentFile().exists()){				//判断有没有父路径，就是判断文件整个路径是否存在
			return dir.getParentFile().mkdirs();		//不存在就全部创建
		}
		return false;
	}

	/**
	 * 删除文件
	 * @param filePathAndName
	 *            String 文件路径及名称 如c:/fqf.txt
	 *            String
	 * @return boolean
	 */
	public static void delFile(String filePathAndName) {
		try {
			String filePath = filePathAndName;
			filePath = filePath.toString();
			java.io.File myDelFile = new java.io.File(filePath);
			myDelFile.delete();
		} catch (Exception e) {
			System.out.println("删除文件操作出错");
			e.printStackTrace();
		}
	}

	/**
	 * 读取到字节数组0
	 * @param filePath //路径
	 * @throws IOException
	 */
	public static byte[] getContent(String filePath) throws IOException {
		File file = new File(filePath);
		long fileSize = file.length();
		if (fileSize > Integer.MAX_VALUE) {
			System.out.println("file too big...");
			return null;
		}
		FileInputStream fi = new FileInputStream(file);
		byte[] buffer = new byte[(int) fileSize];
		int offset = 0;
		int numRead = 0;
		while (offset < buffer.length
				&& (numRead = fi.read(buffer, offset, buffer.length - offset)) >= 0) {
			offset += numRead;
		}
		// 确保所有数据均被读取
		if (offset != buffer.length) {
			throw new IOException("Could not completely read file " + file.getName());
		}
		fi.close();
		return buffer;
	}

	/**
	 * 读取到字节数组1
	 * 
	 * @param filePath
	 * @return
	 * @throws IOException
	 */
	public static byte[] toByteArray(String filePath) throws IOException {

		File f = new File(filePath);
		if (!f.exists()) {
			throw new FileNotFoundException(filePath);
		}
		ByteArrayOutputStream bos = new ByteArrayOutputStream((int) f.length());
		BufferedInputStream in = null;
		try {
			in = new BufferedInputStream(new FileInputStream(f));
			int buf_size = 1024;
			byte[] buffer = new byte[buf_size];
			int len = 0;
			while (-1 != (len = in.read(buffer, 0, buf_size))) {
				bos.write(buffer, 0, len);
			}
			return bos.toByteArray();
		} catch (IOException e) {
			e.printStackTrace();
			throw e;
		} finally {
			try {
				in.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
			bos.close();
		}
	}

	/**
	 * 读取到字节数组2
	 * 
	 * @param filePath
	 * @return
	 * @throws IOException
	 */
	public static byte[] toByteArray2(String filePath) throws IOException {
		File f = new File(filePath);
		if (!f.exists()) {
			throw new FileNotFoundException(filePath);
		}
		FileChannel channel = null;
		FileInputStream fs = null;
		try {
			fs = new FileInputStream(f);
			channel = fs.getChannel();
			ByteBuffer byteBuffer = ByteBuffer.allocate((int) channel.size());
			while ((channel.read(byteBuffer)) > 0) {
				// do nothing
				// System.out.println("reading");
			}
			return byteBuffer.array();
		} catch (IOException e) {
			e.printStackTrace();
			throw e;
		} finally {
			try {
				channel.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
			try {
				fs.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	/**
	 * Mapped File way MappedByteBuffer 可以在处理大文件时，提升性能
	 * 
	 * @param filePath
	 * @return
	 * @throws IOException
	 */
	public static byte[] toByteArray3(String filePath) throws IOException {

		FileChannel fc = null;
		RandomAccessFile rf = null;
		try {
			rf = new RandomAccessFile(filePath, "r");
			fc = rf.getChannel();
			MappedByteBuffer byteBuffer = fc.map(MapMode.READ_ONLY, 0,
					fc.size()).load();
			//System.out.println(byteBuffer.isLoaded());
			byte[] result = new byte[(int) fc.size()];
			if (byteBuffer.remaining() > 0) {
				// System.out.println("remain");
				byteBuffer.get(result, 0, byteBuffer.remaining());
			}
			return result;
		} catch (IOException e) {
			e.printStackTrace();
			throw e;
		} finally {
			try {
				rf.close();
				fc.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}


	/**
	 * 复制单个文件
	 */
	private static boolean copyFile(File oldFile, String newPath) {
		Logger logger = Logger.getLogger("copyFile");
		oldFile = normalizeFile(oldFile);
		newPath = normalizePath(newPath);
		if (!oldFile.exists()) { // 文件存在时
			logger.getLog4jLogger().warn("文件不存在：" + oldFile);
			return false;
		}
		if (!oldFile.isFile()) { // 文件存在时
			logger.getLog4jLogger().warn(oldFile + "不是文件");
			return false;
		}
		if(oldFile.getName().equalsIgnoreCase("Thumbs.db")){
			logger.getLog4jLogger().warn(oldFile + "忽略此文件");
			return true;
		}

		try {
			int byteread = 0;
			InputStream inStream = new FileInputStream(oldFile); // 读入原文件
			File newFile = new File(newPath);
			//如果新文件是一个目录，则创建新的File对象
			if(newFile.isDirectory()){
				newFile = new File(newPath,oldFile.getName());
			}
			FileOutputStream fs = new FileOutputStream(newFile);
			byte[] buffer = new byte[1024];
			while ((byteread = inStream.read(buffer)) != -1) {
				fs.write(buffer, 0, byteread);
			}
			fs.close();
			inStream.close();
		} catch (Exception e) {
			logger.getLog4jLogger().warn("复制单个文件" + oldFile.getPath() + "操作出错。错误原因:" + e.getMessage());
			e.printStackTrace();
			return false;
		}
		return true;
	}

	/**
	 * 复制整个文件夹内容
	 */
	public static boolean copyDir(File oldDir, String newPath) {
		Logger logger = Logger.getLogger("copyFile");
		oldDir = normalizeFile(oldDir);
		newPath = normalizePath(newPath);
		if (!oldDir.exists()) { // 文件存在时
			logger.getLog4jLogger().info("文件夹不存在：" + oldDir);
			return false;
		}
		if (!oldDir.isDirectory()) { // 文件存在时
			logger.getLog4jLogger().info(oldDir + "不是文件夹");
			return false;
		}
		try {
			(new File(newPath)).mkdirs(); // 如果文件夹不存在 则建立新文件夹
			File[] files = oldDir.listFiles();
			File temp = null;
			for (int i = 0; i < files.length; i++) {
				temp = files[i];
				if (temp.isFile()) {
					if (!FileUtil.copyFile(temp, newPath + "/" + temp.getName())) {
						return false;
					}
				} else if (temp.isDirectory()) {// 如果是子文件夹
					if (!FileUtil.copyDir(temp, newPath + "/" + temp.getName())) {
						return false;
					}
				}
			}
			return true;
		} catch (Exception e) {
			logger.getLog4jLogger().info("复制整个文件夹内容操作出错。错误原因:" + e.getMessage());
			// e.printStackTrace();
			return false;
		}
	}

	public static File normalizeFile(File f) {
		String path = f.getAbsolutePath();
		path = normalizePath(path);
		return new File(path);
	}

	/**
	 * 将文件路径规则化，去掉其中多余的/和\，去掉可能造成文件信息泄漏的../
	 */
	public static String normalizePath(String path) {
		path = path.replace('\\', '/');
		path = StringUtil.replaceEx(path, "../", "/");
		path = StringUtil.replaceEx(path, "./", "/");
		if (path.endsWith("..")) {
			path = path.substring(0, path.length() - 2);
		}
		path = path.replaceAll("/+", "/");
		return path;
	}

	/*****************************************
	 * 集成内容如下
	 * ***************************************/

	/**
	 * 将文件路径规则化，去掉其中多余的/和\，去掉可能造成文件信息泄漏的../
	 */

	/**
	 * 以全局编码将指定内容写入指定文件
	 */
	public static boolean writeText(String fileName, String content) {
		fileName = normalizePath(fileName);
		return writeText(fileName, content, Constant.GlobalCharset);
	}

	/**
	 * 依据原文本编码进行保存写入
	 * */
	public static boolean writeTextAuto(String fileName, String content) {
		fileName = normalizePath(fileName);
		try {
			return writeText(fileName,content,codeString(fileName));
		} catch (Exception e) {
			LogUtil.getLogger().warn("动态判断文件编码写入文件错误后改用全局编码进行写入：" + e);
			return writeText(fileName, content, Constant.GlobalCharset);
		}

	}

	/**
	 * 以指定编码将指定内容写入指定文件
	 */
	public static boolean writeText(String fileName, String content, String encoding) {
		fileName = normalizePath(fileName);
		return writeText(fileName, content, encoding, false);
	}

	/**
	 * 以指定编码将指定内容写入指定文件，如果编码为UTF-8且bomFlag为true,则在文件头部加入3字节的BOM
	 */
	public static boolean writeText(String fileName, String content, String encoding, boolean bomFlag) {
		fileName = normalizePath(fileName);
		try {
			byte[] bs = content.getBytes(encoding);
			if (encoding.equalsIgnoreCase("UTF-8") && bomFlag) {
				bs = ArrayUtils.addAll(StringUtil.BOM, bs);
			}
			writeByte(fileName, bs);
		} catch (Exception e) {
			return false;
		}
		return true;
	}

	/**
	 * 以二进制方式读取文件
	 */
	public static byte[] readByte(String fileName) {
		fileName = normalizePath(fileName);
		try {
			FileInputStream fis = new FileInputStream(fileName);
			byte[] r = new byte[fis.available()];
			fis.read(r);
			fis.close();
			return r;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 以二进制方式读取文件
	 */
	public static byte[] readByte(File f) {
		f = normalizeFile(f);
		try {

			FileInputStream fis = new FileInputStream(f);
			byte[] r = readByte(fis);
			fis.close();
			return r;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 读取指定流，并转换为二进制数组
	 */
	public static byte[] readByte(InputStream is) {
		try {
			byte[] r = new byte[is.available()];
			is.read(r);
			return r;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 将二进制数组写入指定文件
	 */
	public static boolean writeByte(String fileName, byte[] b) {
		fileName = normalizePath(fileName);
		try {
			BufferedOutputStream fos = new BufferedOutputStream(new FileOutputStream(fileName));
			fos.write(b);
			fos.close();
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	/**
	 * 将二进制数组写入指定文件
	 */
	public static boolean writeByte(File f, byte[] b) {
		f = normalizeFile(f);
		try {
			BufferedOutputStream fos = new BufferedOutputStream(new FileOutputStream(f));
			fos.write(b);
			fos.close();
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	/**
	 * 以全局编码读取指定文件中的文本
	 */
	public static String readText(File f) {
		f = normalizeFile(f);
		return readText(f, Constant.GlobalCharset);
	}

	/**
	 * 以指定编码读取指定文件中的文本
	 */
	public static String readText(File f, String encoding) {
		f = normalizeFile(f);
		try {
			InputStream is = new FileInputStream(f);
			String str = readText(is, encoding);
			is.close();
			return str;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 以指定编码读取流中的文本
	 */
	public static String readText(InputStream is, String encoding) {
		try {
			byte[] bs = readByte(is);
			if (encoding.equalsIgnoreCase("utf-8")) {// 如果是UTF8则要判断有没有BOM
				if (StringUtil.hexEncode(ArrayUtils.subarray(bs, 0, 3)).equals("efbbbf")) {// BOM标志
					bs = ArrayUtils.subarray(bs, 3, bs.length);
				}
			}
			return new String(bs, encoding);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 以全局编码读取指定文件中的文本
	 */
	public static String readText(String fileName) {
		fileName = normalizePath(fileName);
		return readText(fileName, Constant.GlobalCharset);
	}

	/**
	 * 动态读取文件编码
	 * */
	public static String readTextAuto(String fileName){
		fileName = normalizePath(fileName);
		try {
			return readText(fileName,codeString(fileName));
		} catch (Exception e) {
			LogUtil.getLogger().warn("动态读取文件编码错误后将采取全局编码读取：" + e);
			return readText(fileName, Constant.GlobalCharset);
		}
	}

	/**
	 * 以指定编码读取指定文件中的文本
	 */
	public static String readText(String fileName, String encoding) {
		fileName = normalizePath(fileName);
		try {
			InputStream is = new FileInputStream(fileName);
			String str = readText(is, encoding);
			is.close();
			return str;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 以全局编码读取指定URL中的文本
	 */
	public static String readURLText(String urlPath) {
		return readURLText(urlPath, Constant.GlobalCharset);
	}

	/**
	 * 以指定编码读取指定URL中的文本
	 */
	public static String readURLText(String urlPath, String encoding) {
		try {
			URL url = new URL(urlPath);
			BufferedReader in = new BufferedReader(new InputStreamReader(url.openStream(), encoding));
			String line;
			StringBuffer sb = new StringBuffer();
			while ((line = in.readLine()) != null) {
				sb.append(line + "\n");
			}
			in.close();
			return sb.toString();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 删除文件，不管路径是文件还是文件夹，都删掉。<br>
	 * 删除文件夹时会自动删除子文件夹。
	 */
	public static boolean delete(String path) {
		path = normalizePath(path);
		File file = new File(path);
		return delete(file);
	}

	/**
	 * 删除文件，不管路径是文件还是文件夹，都删掉。<br>
	 * 删除文件夹时会自动删除子文件夹。
	 */
	public static boolean delete(File f) {
		f = normalizeFile(f);
		if (!f.exists()) {
			LogUtil.getLogger().warn("文件或文件夹不存在：" + f);
			return false;
		}
		if (f.isFile()) {
			return f.delete();
		} else {
			return FileUtil.deleteDir(f);
		}
	}

	/**
	 * 删除文件夹及其子文件夹
	 */
	private static boolean deleteDir(File dir) {
		dir = normalizeFile(dir);
		try {
			return deleteFromDir(dir) && dir.delete(); // 先删除完里面所有内容再删除空文件夹
		} catch (Exception e) {
			LogUtil.getLogger().warn("删除文件夹操作出错");
			// e.printStackTrace();
			return false;
		}
	}

	/**
	 * 创建文件夹
	 */
	public static boolean mkdir(String path) {
		path = normalizePath(path);
		File dir = new File(path);
		if (!dir.exists()) {
			dir.mkdirs();
		}
		return true;
	}

	/**
	 * 通配符方式删除指定目录下的文件或文件夹。<br>
	 * 文件名支持使用正则表达式（文件路径不支持正则表达式）
	 */
	public static boolean deleteEx(String fileName) {
		fileName = normalizePath(fileName);
		int index1 = fileName.lastIndexOf("\\");
		int index2 = fileName.lastIndexOf("/");
		index1 = index1 > index2 ? index1 : index2;
		String path = fileName.substring(0, index1);
		String name = fileName.substring(index1 + 1);
		File f = new File(path);
		if (f.exists() && f.isDirectory()) {
			File[] files = f.listFiles();
			for (int i = 0; i < files.length; i++) {
				if (Pattern.matches(name, files[i].getName())) {
					files[i].delete();
				}
			}
			return true;
		}
		return false;
	}

	/**
	 * 删除文件夹里面的所有文件,但不删除自己本身
	 */
	public static boolean deleteFromDir(String dirPath) {
		dirPath = normalizePath(dirPath);
		File file = new File(dirPath);
		return deleteFromDir(file);
	}

	/**
	 * 删除文件夹里面的所有文件和子文件夹,但不删除自己本身
	 *
	 * @param dir
	 * @return
	 */
	public static boolean deleteFromDir(File dir) {
		dir = normalizeFile(dir);
		if (!dir.exists()) {
			LogUtil.getLogger().warn("文件夹不存在：" + dir);
			return false;
		}
		if (!dir.isDirectory()) {
			LogUtil.getLogger().warn(dir + "不是文件夹");
			return false;
		}
		File[] tempList = dir.listFiles();
		for (int i = 0; i < tempList.length; i++) {
			if (!delete(tempList[i])) {
				return false;
			}
		}
		return true;
	}

	/**
	 * 从指定位置复制文件到另一个文件夹，复制时不符合filter条件的不复制
	 */
	public static boolean copy(String oldPath, String newPath, FileFilter filter) {
		oldPath = normalizePath(oldPath);
		newPath = normalizePath(newPath);
		File oldFile = new File(oldPath);
		File[] oldFiles = oldFile.listFiles(filter);
		boolean flag = true;
		if (oldFiles != null) {
			for (int i = 0; i < oldFiles.length; i++) {
				if (!copy(oldFiles[i], newPath + "/" + oldFiles[i].getName())) {
					flag = false;
				}
			}
		}
		return flag;
	}

	/**
	 * 从指定位置复制文件到另一个文件夹
	 */
	public static boolean copy(String oldPath, String newPath) {
		oldPath = normalizePath(oldPath);
		newPath = normalizePath(newPath);
		File oldFile = new File(oldPath);
		return copy(oldFile, newPath);
	}

	public static boolean copy(File oldFile, String newPath) {
		oldFile = normalizeFile(oldFile);
		newPath = normalizePath(newPath);
		if (!oldFile.exists()) {
			LogUtil.getLogger().warn("文件或者文件夹不存在：" + oldFile);
			return false;
		}
		if (oldFile.isFile()) {
			return copyFile(oldFile, newPath);
		} else {
			return copyDir(oldFile, newPath);
		}
	}

	/**
	 * 移动文件到指定目录
	 */
	public static boolean move(String oldPath, String newPath) {
		oldPath = normalizePath(oldPath);
		newPath = normalizePath(newPath);
		return copy(oldPath, newPath) && delete(oldPath);
	}

	/**
	 * 移动文件到指定目录
	 */
	public static boolean move(File oldFile, String newPath) {
		oldFile = normalizeFile(oldFile);
		newPath = normalizePath(newPath);
		return copy(oldFile, newPath) && delete(oldFile);
	}

	/**
	 * 将可序列化对象序列化并写入指定文件
	 */
	public static void serialize(Serializable obj, String fileName) {
		fileName = normalizePath(fileName);
		try {
			FileOutputStream f = new FileOutputStream(fileName);
			ObjectOutputStream s = new ObjectOutputStream(f);
			s.writeObject(obj);
			s.flush();
			s.close();
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	/**
	 * 将可序列化对象序列化并返回二进制数组
	 */
	public static byte[] serialize(Serializable obj) {
		try {
			ByteArrayOutputStream b = new ByteArrayOutputStream();
			ObjectOutputStream s = new ObjectOutputStream(b);
			s.writeObject(obj);
			s.flush();
			s.close();
			return b.toByteArray();
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	/**
	 * 从指定文件中反序列化对象
	 */
	public static Object unserialize(String fileName) {
		fileName = normalizePath(fileName);
		try {
			FileInputStream in = new FileInputStream(fileName);
			ObjectInputStream s = new ObjectInputStream(in);
			Object o = s.readObject();
			s.close();
			return o;
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	/**
	 * 从二进制数组中反序列化对象
	 */
	public static Object unserialize(byte[] bs) {
		try {
			ByteArrayInputStream in = new ByteArrayInputStream(bs);
			ObjectInputStream s = new ObjectInputStream(in);
			Object o = s.readObject();
			s.close();
			return o;
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	/**
	 * 将一个Mapx高性能序列化,键值只能为字符串<br>
	 */
	public static byte[] mapToBytes(Mapx map) {
		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		try {
			Object[] ks = map.keyArray();
			Object[] vs = map.valueArray();
			for (int i = 0; i < map.size(); i++) {
				String k = String.valueOf(ks[i]);
				Object v = vs[i];
				if (v == null) {
					bos.write(new byte[] { 0 });
				} else if (v instanceof String) {
					bos.write(new byte[] { 1 });
				} else if (v instanceof Long) {
					bos.write(new byte[] { 2 });
				} else if (v instanceof Integer) {
					bos.write(new byte[] { 3 });
				} else if (v instanceof Boolean) {
					bos.write(new byte[] { 4 });
				} else if (v instanceof Date) {
					bos.write(new byte[] { 5 });
				} else if (v instanceof Mapx) {
					bos.write(new byte[] { 6 });
				} else if (v instanceof Serializable) {
					bos.write(new byte[] { 7 });
				} else {
					throw new RuntimeException("未知的数据类型:" + v.getClass().getName());
				}
				byte[] bs = k.getBytes();
				bos.write(NumberUtil.toBytes(bs.length));
				bos.write(bs);
				if (v == null) {
					continue;
				} else if (v instanceof String) {
					bs = v.toString().getBytes();
					bos.write(NumberUtil.toBytes(bs.length));
					bos.write(bs);
				} else if (v instanceof Long) {
					bos.write(NumberUtil.toBytes(((Long) v).longValue()));
				} else if (v instanceof Integer) {
					bos.write(NumberUtil.toBytes(((Integer) v).intValue()));
				} else if (v instanceof Boolean) {
					bos.write(((Boolean) v).booleanValue() ? 1 : 0);
				} else if (v instanceof Date) {
					bos.write(NumberUtil.toBytes(((Date) v).getTime()));
				} else if (v instanceof Mapx) {
					byte[] arr = mapToBytes((Mapx) v);
					bos.write(NumberUtil.toBytes(arr.length));
					bos.write(arr);
				} else if (v instanceof Serializable) {
					byte[] arr = serialize((Serializable) v);
					bos.write(NumberUtil.toBytes(arr.length));
					bos.write(arr);
				}
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		return bos.toByteArray();
	}

	/**
	 * 将一个二进制数组反序列化为Mapx
	 */
	public static Mapx bytesToMap(byte[] arr) {
		ByteArrayInputStream bis = new ByteArrayInputStream(arr);
		int b = -1;
		Mapx map = new Mapx();
		byte[] kbs = new byte[4];
		byte[] vbs = null;
		try {
			while ((b = bis.read()) != -1) {
				bis.read(kbs);
				int len = NumberUtil.toInt(kbs);
				vbs = new byte[len];
				bis.read(vbs);
				String k = new String(vbs);
				Object v = null;
				if (b == 1) {
					bis.read(kbs);
					len = NumberUtil.toInt(kbs);
					vbs = new byte[len];
					bis.read(vbs);
					v = new String(vbs);
				} else if (b == 2) {
					vbs = new byte[8];
					bis.read(vbs);
					v = new Long(NumberUtil.toLong(vbs));
				} else if (b == 3) {
					vbs = new byte[4];
					bis.read(vbs);
					v = new Integer(NumberUtil.toInt(vbs));
				} else if (b == 4) {
					int i = bis.read();
					v = new Boolean(i == 1 ? true : false);
				} else if (b == 5) {
					vbs = new byte[8];
					bis.read(vbs);
					v = new Date(NumberUtil.toLong(vbs));
				} else if (b == 6) {
					bis.read(kbs);
					len = NumberUtil.toInt(kbs);
					vbs = new byte[len];
					bis.read(vbs);
					v = bytesToMap(vbs);
				} else if (b == 7) {
					bis.read(kbs);
					len = NumberUtil.toInt(kbs);
					vbs = new byte[len];
					bis.read(vbs);
					v = unserialize(vbs);
				}
				map.put(k, v);
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		return map;
	}

	/**
	 * 判断文件的编码格式
	 * @param fileName :file
	 * @return 文件编码格式
	 * @throws Exception
	 */
	public static String codeString(String fileName) throws Exception{
		String code = null;
		if(isUTF8(toByteArray(fileName))){
			code = "UTF-8";
		}else{
			code = "GBK";
		}
		return code;
	}


	//UTF-8编码规范 及如何判断文本是UTF-8编码的
//UTF-8的编码规则很简单，只有二条：
//1）对于单字节的符号，字节的第一位设为0，后面7位为这个符号的unicode码。因此对于英语字母，UTF-8编码和ASCII码是相同的。
//2）对于n字节的符号（n>1），第一个字节的前n位都设为1，第n+1位设为0，后面字节的前两位一律设为10。剩下的没有提及的二进制位，全部为这个符号的unicode码。
//根据以上说明 下面给出一段java代码判断UTF-8格式
	/**
	 * UTF-8编码格式判断
	 *
	 * @param rawtext
	 *需要分析的数据
	 * @return 是否为UTF-8编码格式
	 */
	public static boolean isUTF8(byte[] rawtext) {
		int score = 0;
		int i, rawtextlen = 0;
		int goodbytes = 0, asciibytes = 0;
		rawtextlen = rawtext.length;
		for (i = 0; i < rawtextlen; i++) {
			if ((rawtext[i] & (byte) 0x7F) == rawtext[i]) {
				// 最高位是0的ASCII字符
				asciibytes++;
				// Ignore ASCII, can throw off count
			} else if (-64 <= rawtext[i] && rawtext[i] <= -33 && i + 1 < rawtextlen && -128 <= rawtext[i + 1] && rawtext[i + 1] <= -65)
			{
				goodbytes += 2;
				i++;
			} else if (-32 <= rawtext[i] && rawtext[i] <= -17 && i + 2 < rawtextlen && -128 <= rawtext[i + 1] && rawtext[i + 1] <= -65 && -128 <= rawtext[i + 2] && rawtext[i + 2] <= -65)
			{
				goodbytes += 3;
				i += 2;
			}
		}
		if (asciibytes == rawtextlen) {
			return false;
		}
		score = 100 * goodbytes / (rawtextlen - asciibytes);
		if (score > 98) {
			return true;
		} else if (score > 95 && goodbytes > 30) {
			return true;
		} else {
			return false;
		}
	}

	public static void main(String[] args) {
		File f = new File("F:/Workspace_Product\\nswtp\\UI\\Framework\\Controls/../../..");
		System.out.println(f.list().length);
		System.out.println(f.getAbsolutePath());
	}


}