package com.dash.main.service;

import com.dash.common.model.Criterion;
import com.dash.common.model.ReturnData;
import com.dash.conf.persistence.DashConfMapper;
import com.dash.main.persistence.MainMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.io.*;
import java.nio.file.*;
import java.text.SimpleDateFormat;
import java.util.*;

@Service("mainService")
@Transactional
public class MainServiceImpl implements MainService {

    @Resource(name = "mainMapper")
    private MainMapper mapper;
    @Resource(name = "dashConfMapper")
    private DashConfMapper dashConfMapper;

    @Override
    public ReturnData getRefreshTime() {
        return new ReturnData(mapper.selectRefreshTime());
    }

    @Override
    public ReturnData chgRefreshTime(Criterion criterion) {
        return new ReturnData(mapper.updateRefreshTime(criterion.getCondition()));
    }

    @Override
    public ReturnData editPanelTitle(Criterion criterion) {
        return new ReturnData(mapper.updatePanelTitle(criterion.getCondition()));
    }

    @Override
    public ReturnData getWidgetResizeList(Criterion criterion) {
        return new ReturnData(mapper.selectWidgetResizeList(criterion.getCondition()));
    }

    @Override
    public ReturnData addWidgetResizeList(Criterion criterion) {
        return new ReturnData(mapper.insertWidgetResizeList(criterion.getCondition()));
    }

    @Override
	public void fileUploadLocal(MultipartFile multipartFile, String tempFileName) throws IOException {
        //소스파일 내부가 아닌 외부 디렉토리
		Path folderPath = Paths.get("/HmHome/netis/web/webobject" + "/upload");
		if (!Files.exists(folderPath)) {
			try {
				Files.createDirectories(folderPath);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}

		Path path = Paths.get("/HmHome/netis/web/webobject" + "/upload", tempFileName);
		try {
			OutputStream os = new BufferedOutputStream(Files.newOutputStream(path, StandardOpenOption.CREATE_NEW));
			os.write(multipartFile.getBytes());
			os.flush();
			os.close();
		}catch(FileAlreadyExistsException e){

            FileOutputStream fos = new FileOutputStream(String.valueOf(path));
            fos.write(multipartFile.getBytes());
            fos.flush();
			fos.close();
        }
		catch (IOException e) {
			e.printStackTrace();
		}
	}

	@Override
	public void fileUploadLocalDevelopment(MultipartFile multipartFile, String tempFileName, HttpServletRequest request) throws IOException {
        //소스파일 내부가 아닌 외부 디렉토리
        String myDir = System.getProperty("user.dir");
        Path folderPath = Paths.get(myDir + "/view/static/img");
        //Path folderPath = Paths.get("/HmHome/netis/web/webobject" + "/upload");
		if (!Files.exists(folderPath)) {
			try {
				Files.createDirectories(folderPath);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
        Path path = Paths.get(myDir + "/view/static/img", tempFileName);
        //Path path = Paths.get("/HmHome/netis/web/webobject" + "/upload", tempFileName);
		try {
			OutputStream os = new BufferedOutputStream(Files.newOutputStream(path, StandardOpenOption.CREATE_NEW));
			os.write(multipartFile.getBytes());
			os.flush();
			os.close();
		}catch(FileAlreadyExistsException e){

            FileOutputStream fos = new FileOutputStream(String.valueOf(path));
            fos.write(multipartFile.getBytes());
            fos.flush();
			fos.close();
        }
		catch (IOException e) {
			e.printStackTrace();
		}
	}

	@Override
    public ReturnData chgDashConf(Criterion criterion) {
        mapper.updateMainTitle(criterion.getCondition());
        dashConfMapper.insertUpdateConfList(criterion.getCondition());
        return new ReturnData("OK");
    }

    @Override
    public ReturnData getDashConf() {
        return new ReturnData(mapper.selectDashConf());
    }

    @Override
    public ReturnData getTemplateList() {
        return new ReturnData(mapper.selectTemplateList());
    }

	@Override
	public ReturnData applyTemplate(Criterion criterion) {
		mapper.insertApplyTemplate(criterion.getCondition());
		mapper.syncCfgGrid(criterion.getCondition());
		return new ReturnData("OK");
	}

	@Override
	public ReturnData addTemplate(Criterion criterion) {
		return new ReturnData(mapper.insertTemplate(criterion.getCondition()));
	}

	@Override
	public ReturnData delTemplate(Criterion criterion) {
		return new ReturnData(mapper.deleteTemplate(criterion.getCondition()));
	}

	@Override
    public ReturnData editWidgetItemConf(Criterion criterion) {
        return new ReturnData(mapper.updateWidgetItemConf(criterion.getCondition()));
    }

    @Override
    public ReturnData test() {
        String myDir = System.getProperty("user.dir");
        File dir = new File(myDir + "/view/static/img/test_upload/bg");
        File[] files = null;
        files = dir.listFiles();


        List<Map<String, Object>> list = new ArrayList<>();

        for(File file : files) {
            Map<String, Object> map = new HashMap<>();
            map.put("filePath", file.getAbsolutePath());
            map.put("fileName", file.getName());
            map.put("fileLength", String.valueOf(file.length()));

            list.add(map);

        }


        return new ReturnData(list);
    }

    @Override
    public ReturnData getBasicWidget(Criterion criterion) {
        return new ReturnData(mapper.selectBasicWidget(criterion.getCondition()));
    }

    @Override
	public ReturnData addBasicWidget(Criterion criterion) {
		return new ReturnData(mapper.insertBasicWidget(criterion.getCondition()));
	}

	@Override
    public ReturnData getEvtConf() {
        return new ReturnData(mapper.selectEvtConf());
    }

    @Override
    public ReturnData getCodeList() {
        return new ReturnData(mapper.selectCodeList());
    }
}
