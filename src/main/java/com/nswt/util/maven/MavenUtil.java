package com.nswt.util.maven;

import org.apache.maven.model.Model;
import org.apache.maven.model.io.xpp3.MavenXpp3Reader;
import org.codehaus.plexus.util.xml.pull.XmlPullParserException;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by hongkai on 2017/4/25.
 */
public class MavenUtil {
    /**
     * 获取Maven  pom配置文件对象
     * @return model
     * */
    public static Model getMavenModel() throws IOException,XmlPullParserException {
        MavenXpp3Reader reader = new MavenXpp3Reader();
        String myPom = System.getProperty("usr.dir") + File.separator + "pom.xml";
        Model model = reader.read(new FileReader(myPom));
        return model;
    }

    /**
     * 在Mac上执行Shell 用于创建工程及应用结构
     * 方法2.0 多参数
     * @param  mavenObject //maven对象
     */
    public static boolean callMacShell(MavenObject mavenObject)
            throws IOException,XmlPullParserException{
        String[] cmd = {mavenObject.getShellpath(),mavenObject.getAppName(),mavenObject.getWorkPath()
                ,mavenObject.getArchetype(),mavenObject.getArchetypeCatalog(),mavenObject.getGroupId()
                ,mavenObject.getVersion(),mavenObject.getArchetypeGroupId(),mavenObject.getArchetypeArtifactId()
                ,mavenObject.getArchetypeVersion(),mavenObject.getArchetypeRepository(),mavenObject.getPackagename()
                ,mavenObject.getInteractiveMode()};
        boolean issuccess = false;
        Process process = null;
        List<String> processList = new ArrayList<String>();
        try {
            Runtime rt = Runtime.getRuntime();
            Process proc = rt.exec(cmd);
            StreamGobbler errorGobbler = new StreamGobbler(proc.getErrorStream(), "ERROR");
            StreamGobbler outputGobbler = new StreamGobbler(proc.getInputStream(), "OUTPUT");
            errorGobbler.start();
            outputGobbler.start();
            int exitVal = proc.waitFor();
            System.out.println("ExitValue: " + exitVal);
            issuccess = true;
        } catch (IOException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        return issuccess;
    }

    static class StreamGobbler extends Thread
    {
        InputStream is;
        String type;  //输出流的类型ERROR或OUTPUT

        StreamGobbler(InputStream is, String type)
        {
            this.is = is;
            this.type = type;
        }

        public void run()
        {
            try
            {
                InputStreamReader isr = new InputStreamReader(is);
                BufferedReader br = new BufferedReader(isr);
                String line=null;
                while ( (line = br.readLine()) != null)
                {
                    System.out.println(type + ">" + line);
                    System.out.flush();
                }
            } catch (IOException ioe)
            {
                ioe.printStackTrace();
            }
        }
    }


    public static void callCmd(String locationCmd){
        try {
            Process child = Runtime.getRuntime().exec("cmd.exe /C start "+locationCmd);
            InputStream in = child.getInputStream();
            int c;
            while ((c = in.read()) != -1) {
            }
            in.close();
            try {
                child.waitFor();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("done");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /***
     * 给要执行的脚本赋值权限
     *
     */
    public static void setpermission(String shellFilePath2) {
        Process process = null;
        List<String> processList = new ArrayList<String>();
        try {
            process = Runtime.getRuntime().exec(new String("chmod 755 "+shellFilePath2));
            BufferedReader input = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line = "";
            while ((line = input.readLine()) != null) {
                processList.add(line);
            }
            input.close();

        } catch (IOException e) {
            e.printStackTrace();
        }

        for (String line : processList) {
            System.out.println(line);
        }
        process.destroy();
    }

    /**
     * 执行MVN命令Shell
     *@param shellFilePath //需要执行的shell脚本
     *@param goPath //在哪个位置进行执行命令
     *@param command //需要执行的mvn命令
     * */
    public static boolean callMacShell(String shellFilePath,String goPath,String command) throws IOException,InterruptedException{
        String[] cmd = {shellFilePath,goPath,command};
        boolean issuccess = false;
        Process process = null;
        List<String> processList = new ArrayList<String>();
        try {
            Runtime rt = Runtime.getRuntime();
            Process proc = rt.exec(cmd);
            StreamGobbler errorGobbler = new StreamGobbler(proc.getErrorStream(), "ERROR");
            StreamGobbler outputGobbler = new StreamGobbler(proc.getInputStream(), "OUTPUT");
            errorGobbler.start();
            outputGobbler.start();
            int exitVal = proc.waitFor();
            System.out.println("ExitValue: " + exitVal);
            issuccess = true;
        } catch (IOException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return issuccess;
    }
}
