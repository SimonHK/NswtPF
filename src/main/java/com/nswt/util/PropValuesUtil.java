package com.nswt.util;

import com.nswt.util.config.Config;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;
import java.util.concurrent.ExecutionException;

/**
 * Created by hongkai on 2017/4/28.
 */
public class PropValuesUtil {

    /**读取*.properties 配置文件
     * @return
     * @throws IOException
     */
    public static Properties getPprVue(String filename) {
        InputStream inputStream = Config.class.getClassLoader().getResourceAsStream(filename);
        Properties p = new Properties();
        try {
            p.load(inputStream);
            inputStream.close();
        } catch (IOException e) {
            //读取配置文件出错
            e.printStackTrace();
        }
        return p;
    }


    public static void main(String[] arg){
            String str = getPprVue("autocreate.properties").getProperty("project_home");
            String str2 = getPprVue("autocreate.properties").getProperty("project_source");
            System.out.print(str+"###"+str2);

    }

}
