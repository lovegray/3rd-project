
// 파일 리스트 번호
var fileIndex = 0;
// 등록할 전체 파일 사이즈
var totalFileSize = 0;
// 파일 리스트
var fileList = new Array();
// 파일 사이즈 리스트
var fileSizeList = new Array();
// 등록 가능한 파일 사이즈 MB
var uploadSize = 50;
// 등록 가능한 총 파일 사이즈 MB
var maxUploadSize = 500;

$(function (){
	// 파일 드롭 다운
	fileDropDown();
});

// 파일 드롭 다운
function fileDropDown(){
	var dropZone = $("#dropZone");
	//Drag기능 
	dropZone.on('dragenter',function(e){
		e.stopPropagation();
		e.preventDefault();
		// 드롭다운 영역 css
		dropZone.css('background-color','#E3F2FC');
		$('#file').attr("src","images/file_up.png");
	});
	dropZone.on('dragleave',function(e){
		e.stopPropagation();
		e.preventDefault();
		// 드롭다운 영역 css
		dropZone.css('background-color','#FFFFFF');
		$('#file').attr("src","../static/images/file.png");
	});
	dropZone.on('dragover',function(e){
		e.stopPropagation();
		e.preventDefault();
		// 드롭다운 영역 css
		dropZone.css('background-color','#E3F2FC');
		$('#file').attr("src","../static/images/file_up.png");
	});
	dropZone.on('drop',function(e){
		e.preventDefault();
		// 드롭다운 영역 css
		dropZone.css('background-color','#FFFFFF');
		var files = e.originalEvent.dataTransfer.files;
		if(files != null){
			if(files.length < 1){
				alert("폴더 업로드 불가");
				return;
			}
			selectFile(files)
		}else{
			alert("ERROR");
		}
		$('#file').css("display","none");
		var myVideo = $("#myVideo");
		myVideo.css("display","inline");
		console.log(window.URL.createObjectURL(files[0]));
		myVideo.attr("src",window.URL.createObjectURL(files[0]));
		console.log("확인", files[0])
	});
}

// preview??
function handleFiles(files) {
	for (var i = 0; i < files.length; i++) {
		var file = files[i];

		var video = document.createElement("video")
		video.classList.add("obj");
		video.file = file;
		video.className = "preview";
		dropZone.appendChild(video);

		var reader = new FileReader();
		reader.onload = (function(aVideo) { 
		videojs(aVideo, { "controls": true, "autoplay": true, "preload": "auto" }).src({ type: "video/mp4", src: e.target.result})

		})(video);
		reader.readAsDataURL(file);
	}
}

// 파일 선택시
function selectFile(files){
	// 다중파일 등록
	if(files != null){
		for(var i = 0; i < files.length; i++){
			// 파일 이름
			var fileName = files[i].name;
			var fileNameArr = fileName.split("\.");
			// 확장자
			var ext = fileNameArr[fileNameArr.length - 1];
			// 파일 사이즈(단위 :MB)
			var fileSize = files[i].size / 1024 / 1024;
			
			if($.inArray(ext, ['exe', 'bat', 'sh', 'java', 'jsp', 'html', 'js', 'css', 'xml']) >= 0){
				// 확장자 체크
				alert("등록 불가 확장자");
				break;
			}else if(fileSize > uploadSize){
				// 파일 사이즈 체크
				alert("용량 초과\n업로드 가능 용량 : " + uploadSize + " MB");
				break;
			}else{
				// 전체 파일 사이즈
				totalFileSize += fileSize;
				
				// 파일 배열에 넣기
				fileList[fileIndex] = files[i];
				
				// 파일 사이즈 배열에 넣기
				fileSizeList[fileIndex] = fileSize;

				// 업로드 파일 목록 생성
				addFileList(fileIndex, fileName, fileSize);

				// 파일 번호 증가
				fileIndex++;
			}
		}
	}else{
		alert("ERROR");
	}
}

// 업로드 파일 목록 생성
function addFileList(fIndex, fileName, fileSize){
	var html = "";
	html += "<div id='fileTr_" + fIndex + "' style='text-align : right;'>";
	//html += "    <td class='left' >";
	//html +=         fileName + " / " + fileSize + "MB "  + "<a href='#' onclick='deleteFile(" + fIndex + "); return false;' class='btn small bg_02'>삭제</a>"
	html +=         fileName + "<a href='#' onclick='deleteFile(" + fIndex + "); return false;' class='btn small bg_02'>&emsp;<i class='fas fa-trash-alt'></i> 삭제</a>"
	//html += "    </td>"
	//html += "</tr>"
	html += "</div>"

	$('#fileName').append(html);
}

// 업로드 파일 삭제
function deleteFile(fIndex){
	// 전체 파일 사이즈 수정
	totalFileSize -= fileSizeList[fIndex];
	
	// 파일 배열에서 삭제
	delete fileList[fIndex];
	
	// 파일 사이즈 배열 삭제
	delete fileSizeList[fIndex];
	
	// 업로드 파일 테이블 목록에서 삭제
	$("#fileTr_" + fIndex).remove();
	$('#file').css("display","inline");
	$('#file').attr("src","../static/images/file.png")
	$('#myVideo').css("display","none");
}

// 파일 등록
function uploadFile(){
	// 등록할 파일 리스트
	var uploadFileList = Object.keys(fileList);

	// 파일이 있는지 체크
	if(uploadFileList.length == 0){
		// 파일등록 경고창
		alert("파일이 없습니다.");
		return;
	}
	
	// 용량을 500MB를 넘을 경우 업로드 불가
	if(totalFileSize > maxUploadSize){
		// 파일 사이즈 초과 경고창
		alert("총 용량 초과\n총 업로드 가능 용량 : " + maxUploadSize + " MB");
		return;
	}
		
	if(confirm("등록 하시겠습니까?")){
		// 등록할 파일 리스트를 formData로 데이터 입력
		var form = $('#myVideo');
		console.log(form);
		var formData = new FormData(form[0]);
		console.log(formData);
		for(var i = 0; i < uploadFileList.length; i++){
			formData.append('files', fileList[uploadFileList[i]]);
		}
		
		$.ajax({
			url:"/fileUpload",
			data:formData,
			type:'POST',
			enctype:'multipart/form-data',
			processData:false,
			contentType:false,
			cache:false,
			success:function(result){
				if(result.data.length > 0){
					alert("성공");
					location.reload();
				}else{
					alert("실패");
					location.reload();
				}
			}
		});
	}
}